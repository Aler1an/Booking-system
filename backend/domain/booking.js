export class Booking {
    constructor(id, user, slot) {
      this.id = id;
      this.user = user;
      this.slot = slot;
      this.createdAt = new Date();
    }
  
    cancel() {
      this.slot.status = "available";
    }
  }
  