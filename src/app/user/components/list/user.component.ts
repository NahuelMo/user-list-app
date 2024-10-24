import { Component, OnInit } from '@angular/core';
import { UserService } from '../../service/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../../types/user';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {

  users: User[] = [];
  userControl = new FormControl();

  filteredUsers: Observable<User[]> | undefined;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe({
      next: (resp) => {
        this.users = [...resp];
        this.formControlInit();
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
      }
    })
  }

  filter(value: string): User[] {
    const filterValue = value.toLowerCase();
    return this.users.filter(user => user.name?.toLowerCase().includes(filterValue));
  }

  formControlInit(): void {
    this.filteredUsers = this.userControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filter(value))
    )
  }

}
