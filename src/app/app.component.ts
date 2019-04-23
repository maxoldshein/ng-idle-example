import { Component } from '@angular/core';

import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  //After 5 minutes of being idle, the user is logged out completely.
  totalIdleSeconds: number = 5 * 60;
  //We give the user 2 minutes of warning before they are logged out.
  idleTimeoutSeconds: number = 2 * 60;
  //The user is considered idle after 3 minutes, but they are logged out after 5 minutes of no activity.
  idleSecondsDifference: number = this.totalIdleSeconds - this.idleTimeoutSeconds

  //This is a boolean to track whether or not the user is idle or not.
  //After 3 minutes of no interruption events, this flag will be set to true.
  //Whenever there is an interrupt, we set this flag back to false because the user is no longer considered idle.
  isIdle: boolean = false;

  //Counters so that we can display the approximate time on the page.
  idleSeconds: number;
  idleMinutes: number;

  //String to hold the last event that occured, so that we can visualize this on the application.
  lastEvent: string = 'none';

  //Interval that will increment the counters so that we can visualize the code.
  idleInterval: any;

  constructor(private idle: Idle) {
    this.initIdle();
  }

  //This initializes the ng-idle framework so that it can track the user's interruptions and idleness.
  private initIdle() {
    //Set the length of time that we want to allow the user to be idle for.
    this.idle.setIdle(this.idleSecondsDifference);

    //The below line of code sets the events that will be considered an 'interruption'.
    //The variable DEFAULT_INTERRUPTSOURCES is a constant that is defined within the ng2-idle framework.
    //The events included in this are: mousemove, keydown, DOMMouseScroll, mousewheel, touchstart, scroll'
    //Note: when developing for production the mousemove event is not recognized in Internet Explorer, consider using pointermove instead.
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    //This function is triggered when 
    this.idle.onInterrupt.subscribe((event: any) => {
      //Reset the counters when we have an interruption.
      this.idleSeconds = 0;
      this.idleMinutes = 0;

      //The user is no longer considered idle, so set this flag as false.
      this.isIdle = false;
      
      console.log('An interruption has occured!');
      console.log('Event: ', event.type);

      this.lastEvent = event.type;
    });

    //This function is triggered when more than 3 minutes has passed since the last interruption event.
    this.idle.onIdleStart.subscribe(() => {
      //The user is now considered idle, so set this flag as true.
      this.isIdle = true;

      console.log('Idleness has begun...');
    })
    
    //This is the initial set up of the timer, we need to initialize the timeout seconds and set the interval, so that we can keep track.
    this.idleSeconds = 0;
    this.idleMinutes = 0;
    this.idleInterval = setInterval(() => { this.tick() }, 1000);

    //There is where we begin to watch for idleness.
    //This is a built in function of the ng-idle framework that detects idleness.
    this.idle.watch();
  }

  tick() {
    this.idleSeconds++;
    this.idleMinutes = Math.floor(this.idleSeconds / 60);

    //If we are idle and the timer is greater than 5 minutes, we log them out.
    if (this.isIdle && this.idleSeconds >= this.totalIdleSeconds) {
      this.logout();
    }
  }

  //Log out function that is called when more the user has timed out.
  logout() {
    //Simulate a log out by reloading the page.
    if (window.confirm(('You have timed out. You have been signed out.'))) {
      location.reload();
    } else {
      location.reload();
    }
  }
}
