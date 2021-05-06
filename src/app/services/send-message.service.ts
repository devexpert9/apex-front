// send-message.service.ts
import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SendMessageService {

  messageEmitter = new EventEmitter<String>(); 

  constructor() { }
}
