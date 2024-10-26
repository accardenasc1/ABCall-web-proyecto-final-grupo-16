import { Component, Inject, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../models/user';
import { UserService } from '../user.service';
import { Client } from '../../models/client';


interface FormData {
  id: FormControl<number | null | undefined>;
  username: FormControl<string | null | undefined>;
  type: FormControl<number | null | undefined>;
  client_id: FormControl<string | null | undefined>;
}

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrl: './edit-modal.component.css'
})
export class EditModalComponent {
  readonly dialogRef = inject(MatDialogRef<EditModalComponent>);
  userForm = new FormGroup<FormData>({
    id: new FormControl(),
    username: new FormControl(''),
    type: new FormControl(1),
    client_id: new FormControl(''),
  });
  types = [0, 1, 2 ,3]

  constructor(@Inject(MAT_DIALOG_DATA) public data: {user: User, clients: Client[]}, private userService: UserService) {
    this.userForm.setValue({
      id: data.user.id,
      username: data.user.username,
      type: data.user.type,
      client_id: data.user.client_id
    })
  }

  onSave () {
    const user = this.userForm.value;
    this.userService.put({
      ...this.data.user,
      type: user.type,
      client_id: user.type?.toString() === '3' ? user.client_id : null
    } as User).subscribe(() => {
      this.dialogRef.close();
    }, error => {
      if (error.error === 'invalid client')
      this.userForm.setErrors({
        invalid_client: true
      })
    });
  }
}
