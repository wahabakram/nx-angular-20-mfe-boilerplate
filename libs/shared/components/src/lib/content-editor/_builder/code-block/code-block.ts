import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef, forwardRef,
  inject,
  input, OnDestroy,
  OnInit,
  signal,
  viewChild
} from '@angular/core';
import {
  CONTENT_BUILDER,
  CONTENT_EDITOR_BLOCK,
  ContentEditorDataBlock
} from '../../types';
import { ContentBuilderStore } from '../../content-builder.store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EditorView, keymap } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { Compartment } from '@codemirror/state';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatButton } from '@angular/material/button';
import { githubLight } from '@uiw/codemirror-theme-github';
import { indentWithTab } from "@codemirror/commands"
import { ContentBuilder } from '../../content-builder/content-builder';

export interface ContentEditorCodeBlockOptions {
  language: string;
}

export interface ContentEditorCodeLanguage {
  language: string;
  name: string;
  library: () => Promise<any>;
}

@Component({
  selector: 'mf-code-block',
  imports: [
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    MatButton
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './code-block.html',
  styleUrl: './code-block.scss',
  providers: [
    {
      provide: CONTENT_EDITOR_BLOCK,
      useExisting: forwardRef(() => CodeBlock),
      multi: true
    }
  ],
  host: {
    'class': 'mf-code-block',
  }
})
export class CodeBlock implements OnInit, OnDestroy, ContentEditorDataBlock {
  private _store = inject(ContentBuilderStore);
  private _contentBuilder = inject<ContentBuilder>(CONTENT_BUILDER);
  private _destroyRef = inject(DestroyRef);

  private _contentRef = viewChild.required<ElementRef<HTMLParagraphElement>>('contentRef');

  id = input.required<string>();
  content = input.required<string>();
  options = input.required<ContentEditorCodeBlockOptions>();
  index = input.required<number>();
  placeholder = input('Write your code here');

  protected _languageList = signal<ContentEditorCodeLanguage[]>([
    {
      language: 'none',
      name: 'None',
      library: () => new Promise(() => {})
    },
    {
      language: 'angular',
      name: 'Angular',
      library: () => import('@codemirror/lang-angular').then(lang => lang.angular())
    },
    {
      language: 'javascript',
      name: 'JavaScript',
      library: () => import('@codemirror/lang-javascript').then(lang => lang.javascript())
    },
    {
      language: 'typescript',
      name: 'TypeScript',
      library: () => import('@codemirror/lang-javascript').then(lang => lang.javascript({ typescript: true }))
    },
    {
      language: 'html',
      name: 'HTML',
      library: () => import('@codemirror/lang-html').then(lang => lang.html())
    },
    {
      language: 'css',
      name: 'CSS',
      library: () => import('@codemirror/lang-css').then(lang => lang.css())
    },
    {
      language: 'sass',
      name: 'Sass',
      library: () => import('@codemirror/lang-sass').then(lang => lang.sass())
    },
    {
      language: 'json',
      name: 'JSON',
      library: () => import('@codemirror/lang-json').then(lang => lang.json())
    }
  ]);
  protected _code = signal<string>('');
  protected _language = signal<ContentEditorCodeLanguage>(this._languageList()[0]);
  protected _isEmpty = signal<boolean>(true);

  private _editorView!: EditorView;
  private _editorLanguage = new Compartment();
  readonly initialized = signal(false);

  async ngOnInit() {
    const codeLanguage = this._languageList().find(
      codeLanguage => codeLanguage.language === this.options().language
    );

    if (codeLanguage) {
      this._language.set(codeLanguage);
    }

    this._code.set(this.content() || '');
    this._isEmpty.set(this._code().length === 0);
    this._contentBuilder
      .focusChanged
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(() => {
        if (this._store.focusedBlockId() === this.id()) {
          this.focus();
        }
      });
    this._editorView = new EditorView({
      doc: this._code(),
      parent: this._contentRef().nativeElement,
      extensions: [
        basicSetup,
        githubLight,
        keymap.of([indentWithTab]),
        this._editorLanguage.of([])
      ]
    });
    await this.selectLanguage(this._language());
    this._editorView.contentDOM.style.width = '0';
    this._store.addDataBlock(this);
    this._editorView.focus();
    this.initialized.set(true);
  }

  ngOnDestroy() {
    this._editorView.destroy();
  }

  focus() {
    const element = this._contentRef().nativeElement;
    const range = window.document.createRange();
    range.setStart(element, 0);
    range.setEnd(element, 0);
    const selection = window.getSelection() as Selection;
    selection.removeAllRanges();
    selection.addRange(range);
  }

  getData(): any {
    return {
      content: this._editorView.state.doc.toString(),
      options: {
        ...this.options(),
        language: this._language().language
      }
    };
  }

  isEmpty(): boolean {
    return this.getData().content.trim().length === 0;
  }

  protected async selectLanguage(codeLanguage: ContentEditorCodeLanguage) {
    this._language.set(codeLanguage);

    if (codeLanguage.language === 'none') {
      this._editorView.dispatch({
        effects: this._editorLanguage.reconfigure([])
      });
    } else {
      const language = await this._language().library();
      this._editorView.dispatch({
        effects: this._editorLanguage.reconfigure(language)
      });
    }
  }
}
