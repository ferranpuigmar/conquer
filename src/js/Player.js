class Player {
  name = "";
  avatar = "";

  constructor(
    name,
    avatar
  ){
    this.name = name;
    this.avatar = avatar;
  }

  getName(){
    return this.name;
  }

  getAvatar(){
    return this.avatar;
  }
}

export default Player;