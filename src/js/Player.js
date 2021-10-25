class Player {
  constructor(
    id,
    name,
    avatar
  ){
    this.id = id;
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