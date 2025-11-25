import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { MatDialogModule, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormField, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatIcon } from '@angular/material/icon';
import { MatOption } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { Dicebear } from '@ng-mf/components';
import { MatDivider } from '@angular/material/divider';
import { MenuOptionGroupDirective } from '@ng-mf/components';

type RoleType = 'owner' | 'view' | 'edit';
export interface Role { id: string; name: string; type: RoleType; }

@Component({
  selector: 'app-invite-to-project',
  imports: [
    ReactiveFormsModule,
    MatDialogModule, MatDialogContent, MatDialogActions,
    MatButton,
    MatFormField, MatInput,
    MatSelect, MatOption,
    MatIcon,
    MatIconButton,
    Dicebear,
    MatMenuModule,
    MatDivider,
    MatSuffix, MenuOptionGroupDirective
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './invite-to-project.dialog.html',
  styleUrl: './invite-to-project.dialog.scss'
})
export class InviteToProjectDialog {
  private fb = inject(FormBuilder);

  readonly roles: Role[] = [
    { id: 'owner', name: 'Owner', type: 'owner' },
    { id: 'view', name: 'Can View', type: 'view' },
    { id: 'edit', name: 'Can Edit', type: 'edit' },
  ];

  roleByName(name: string): Role {
    return this.roles.find(r => r.name === name)!;
  }
  readonly members = signal([
    { name: 'Insan Kamil', email: 'insank@gmail.com', role: this.roleByName('Owner'), avatar: 'https://i.pravatar.cc/64?img=1' },
    { name: 'John Smith', email: 'johnsmith@gmail.com', role: this.roleByName('Can View'), avatar: 'https://i.pravatar.cc/64?img=2' },
    { name: 'Mario Rodriguez', email: 'mariorodriguez@gmail.com', role: this.roleByName('Can Edit'), avatar: 'https://i.pravatar.cc/64?img=3' },
    { name: 'Emily Chen', email: 'emilychen@gmail.com', role: this.roleByName('Can Edit'), avatar: 'https://i.pravatar.cc/64?img=4' },
  ]);

  memberControlName(email: string) {
    // FormGroup keys cannot include '.'; sanitize email for control name
    const safe = email.replaceAll('.', '_').replaceAll('@', '_at_');
    return `role__${safe}`;
  }

  readonly shareAccess = signal('Anyone with link');
  readonly link = signal('https://www.figma.com/some-project');

  // Separate form for Link to Share section
  shareForm = this.fb.group({
    access: this.fb.control<string>(this.shareAccess(), { nonNullable: true }),
    link: this.fb.control<string>(this.link(), { nonNullable: true }),
  });

  // Email invites are captured as an array of { email, role: roleId } items
  invitesForm = this.fb.group({
    items: this.fb.array([] as Array<ReturnType<typeof this.newGroup>>) as FormArray
  });

  newGroup(email = '') {
    return this.fb.group({
      email: this.fb.control<string>(email, { validators: [Validators.required, Validators.email], nonNullable: true }),
      role: this.fb.control<string>(
        'view', { validators: [Validators.required], nonNullable: true }
      )
    });
  }

  get items() { return this.invitesForm.get('items') as FormArray<FormGroup>; }
  addItem(email = '') { this.items.push(this.newGroup(email)); }

  membersForm = this.fb.group({});

  constructor() {
    const group: Record<string, ReturnType<FormBuilder['control']>> = {};
    for (const m of this.members()) {
      group[this.memberControlName(m.email)] = this.fb.control(m.role, { nonNullable: true });
    }
    this.membersForm = this.fb.group(group);
    this.addItem();
  }


  sendInvite() {
    if (this.invitesForm.invalid || this.items.length === 0) {
      return;
    }
    const payload = this.items.value; // array of { email, role: roleId }
    console.log('Inviting', payload);
  }

  copyLink() {
    const value = this.shareForm.controls.link.value;
    navigator.clipboard?.writeText(value).catch(() => {});
  }

  selectRole(ctrl: any, r: Role) {
    const roleCtrl = ctrl?.get?.('role');
    roleCtrl?.setValue(r.id);
    roleCtrl?.markAsDirty();
    roleCtrl?.markAsTouched();
  }

  getRoleName(id?: string | null): string {
    if (!id) return 'Select role';
    const role = this.roles.find(r => r.id === id);
    return role?.name ?? 'Select role';
  }
}
