import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";

class UserDataViewModel {
  user = null;
  userDocRef = null;
  conditions = null;

  constructor() {
    this.user = auth.currentUser.uid;
    this.userDocRef = db.collection("users").doc(this.user);
    this.conditions = [];
  }

  getUserSearches = async () => {
   
  };
}

export default UserDataViewModel;
