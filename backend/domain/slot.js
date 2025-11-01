export class Slot {
    constructor(id, startTime, endTime, status = "available") {
      this.id = id;
      this.startTime = startTime;
      this.endTime = endTime;
      this.status = status;
    }
  
    isAvailable() {
      return this.status === "available";
    }
  
    markAsBooked() {
      this.status = "booked";
    }
  }
  