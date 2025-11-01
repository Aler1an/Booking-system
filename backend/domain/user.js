export class User {
    constructor(id, name, role = "student") {
      this.id = id;
      this.name = name;
      this.role = role;
    }
  
    canManageSlots() {
      return this.role === "admin";
    }
  }
  