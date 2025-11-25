import {
  Component,
  ElementRef,
  inject,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { BlockLoader } from '@ng-mf/components';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Container } from '@/_partials/container/container';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatInput, MatSuffix } from '@angular/material/input';
import { Navigation, NavigationItem } from '@ng-mf/components';
import { PanelBody, Panel, PanelFooter, PanelSidebar } from '@ng-mf/components';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonDirective, SafeHtmlPipe } from '@ng-mf/components';
import { CreateMLCEngine, MLCEngine } from '@mlc-ai/web-llm';
import { marked } from 'marked';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { BreadcrumbsStore } from '@ng-mf/components';

@Component({
  imports: [
    BlockLoader,
    CdkTextareaAutosize,
    Container,
    MatButton,
    MatFormField,
    MatInput,
    MatSuffix,
    Navigation,
    NavigationItem,
    PanelBody,
    Panel,
    PanelFooter,
    ReactiveFormsModule,
    SafeHtmlPipe,
    ButtonDirective,
    FormsModule,
    PanelSidebar,
    MatIconButton,
    MatIcon,
    MatTooltip,
  ],
  templateUrl: './ai-studio.html',
  styleUrl: './ai-studio.scss',
})
export class AiStudio {
  private breadcrumbsStore = inject(BreadcrumbsStore);

  readonly scrollContainer =
    viewChild<ElementRef<HTMLElement>>('scrollContainer');

  prompt = model('');
  readonly loading = signal(false);
  readonly reply = signal('');
  readonly modelLoaded = signal(false);
  readonly fullChat = signal<{ type: string; content: string }[]>([]);
  readonly hasPrompt = signal(false);
  readonly loaderMessage = signal('Loading Model');
  readonly chats = signal<any[]>([]);
  readonly messages: { role: string; content: string }[] = [];
  readonly selectedChat = signal<any>(null);
  readonly loaded = signal(false);

  engine!: any;
  engineInstance!: MLCEngine;

  constructor() {
    this.breadcrumbsStore.setBreadcrumbs([
      {
        id: 'home',
        name: 'Home',
        route: '/',
        type: 'link',
      },
      {
        id: 'contacts',
        name: 'AI Studio',
        type: null,
      },
    ]);
  }

  ngOnInit(): void {
    // this.api.get(`studio/ai`).subscribe((res) => {
    //   this.chats.set(res.chats);
    //   this.loaded.set(true);
    // });
  }

  async send() {
    this.hasPrompt.set(true);
    this.fullChat.update((chat: any) => [
      ...chat,
      { type: 'prompt', content: this.prompt() },
    ]);

    if (!this.selectedChat()) {
      const chat = {
        name: this.prompt().substring(0, 60),
        aiProviderType: 'local',
        messages: [],
      };
      this.selectedChat.set(chat);
      this.chats.update((value: any[]) => {
        value = [this.selectedChat(), ...value];
        return value;
      });
    }

    this.selectedChat().messages.push({
      role: 'user',
      content: this.prompt(),
    });

    await this.loadModel();
    this.loading.set(true);
    this.prompt.set('');
    const chunks = await this.engine.chat.completions.create({
      // @ts-ignore
      messages: this.selectedChat().messages,
      temperature: 1,
      stream: true,
      stream_options: { include_usage: true },
    });

    let reply = '';
    for await (const chunk of chunks) {
      reply += chunk.choices[0]?.delta.content || '';
      this.reply.set(await marked.parse(reply));

      if (chunk.usage) {
        // console.log(chunk.usage);
      }
    }

    this.fullChat.update((chat) => [
      ...chat,
      { type: 'reply', content: this.reply() },
    ]);
    this.reply.set('');
    this.loading.set(false);

    const fullReply = await this.engine.getMessage();
    console.log(fullReply);

    this.scrollToEnd();
  }

  async selectChat(chat: any) {
    this.fullChat.set(chat.fullChat);
    this.selectedChat.set(chat);
    await this.loadModel();
  }

  newChat() {
    this.fullChat.set([]);
    this.selectedChat.set(null);
  }

  private async loadModel() {
    if (this.modelLoaded()) {
      this.scrollToEnd();
      return;
    }

    const initProgressCallback = (progress: any) => {
      this.loaderMessage.set(progress.text);
    };

    // 'Llama-3.2-1B-Instruct-q4f32_1-MLC', super fast
    // 'Hermes-3-Llama-3.1-8B-q4f16_1-MLC',
    // Mistral-7B-Instruct-v0.3-q4f16_1-MLC knows resend.com!
    // gemma-2-2b-it-q4f32_1-MLC - slow but smart

    try {
      this.engine = await CreateMLCEngine(
        'Llama-3.2-1B-Instruct-q4f32_1-MLC',
        {
          // appConfig: {
          //   model_list: [
          //   ],
          //   useIndexedDBCache: true,
          // },
          initProgressCallback,
        }
        // {
        //   context_window_size: 2048,
        // }
      );

      this.engineInstance = new MLCEngine({ initProgressCallback });
      // console.log('engine: ', engine);
      // console.log('engineInstance: ', engineInstance);
      this.modelLoaded.set(true);
      this.scrollToEnd();
    } catch (error) {
      console.error(error);
      this.hasPrompt.set(false);
      this.modelLoaded.set(false);
      this.loading.set(false);
    }
  }

  private scrollToEnd() {
    if (this.scrollContainer()) {
      const element = this.scrollContainer()?.nativeElement as HTMLElement;
      element.scrollTop = element.scrollHeight;
    }
  }
}
