import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { ProfileState } from '../../ngrx/profile/profile.state';
import { MaterialModule } from '../../shared/modules/material.module';
import { AuthState } from '../../ngrx/auth/auth.state';
import * as ProfileActions from '../../ngrx/profile/profile.actions';
import { LoadingComponent } from '../loading/loading.component';
import { SharedModule } from '../../shared/modules/shared.module';
import { GameState } from '../../ngrx/game/game.state';
import * as GameActions from '../../ngrx/game/game.actions';
import { GameService } from '../../services/game/game.service';

@Component({
  selector: 'app-join',
  standalone: true,
  imports: [MaterialModule, LoadingComponent, SharedModule],
  templateUrl: './join.component.html',
  styleUrl: './join.component.scss',
})
export class JoinComponent implements OnInit, OnDestroy {
  constructor(
    private store: Store<{
      profile: ProfileState;
      auth: AuthState;
      game: GameState;
    }>,
    private router: Router,
    private gameService: GameService,
  ) {}

  pin: string = '';
  isEmptyInput = false;
  isCheckRoom = true;

  subscriptions: Subscription[] = [];
  dashboard: string = 'My dashboard';
  profile$ = this.store.select('profile', 'profile');
  isGettingProfile$ = this.store.select(
    'profile',
    'isGettingProfileSuccessful',
  );

  ngOnInit(): void {
    this.gameService.listenForErrors().subscribe((error) => {
      if (error === 'Room not found') {
        this.isCheckRoom = false;
        alert('Room not found');
      }
      if (error === 'Game has already started') {
        this.isCheckRoom = false;
        alert('Game has already started');
      }
    });
    this.subscriptions.push(
      this.store.select('auth', 'idToken').subscribe((token) => {
        if (token) {
          this.store.dispatch(ProfileActions.getProfile({ idToken: token }));
        }
      }),
      this.isGettingProfile$.subscribe((isGettingProfile) => {
        if (isGettingProfile) {
          this.profile$.subscribe((profile) => {
            if (profile) {
              this.dashboard = profile.fullName + "'s dashboard";
            }
          });
        }
      }),
    );
  }

  homePage() {
    this.router.navigate(['/home']);
  }

  joinGame() {
    if (this.pin.length == 0) {
      this.isEmptyInput = !this.isEmptyInput;
      return;
    }
    this.gameService.listenForNavigateToEnterName(this.pin);

    this.gameService.checkRoomExist(this.pin);
  }

  onKey(event: any) {
    if (event.key === 'Enter') {
      this.joinGame();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
