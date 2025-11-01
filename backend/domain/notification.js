export class Notification {
    constructor(user, message) {
      this.user = user;
      this.message = message;
      this.sentAt = null;
    }
  
    send() {
      this.sentAt = new Date();
      console.log(`📢 Notification for ${this.user.name}: ${this.message}`);
    }
  }
  