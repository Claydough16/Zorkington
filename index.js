const readline = require('readline');
const readlineInterface = readline.createInterface(process.stdin, process.stdout);

class Door {
  constructor(locked, description, password="", lockedDescription="") {
    this.locked = locked
    this.description = description
    this.password = password
    this.lockedDescription = lockedDescription
  }
  
  tryUnlock(code) {
      if (code == this.password) {
        this.locked = false;
        console.log("unlocked!")
        return true
      } else {
        console.log("no unlock")
        return false
      }
    }
}

class Room {
  constructor(description, inventory) {
    this.description = description;
    this.inventory = inventory;
    this.northRoomConnection = null;
    this.eastRoomConnection = null;
    this.southRoomConnection = null;
    this.westRoomConnection = null;
  }

  setNorthRoomConnection(northRoomConnection) {
    this.northRoomConnection = northRoomConnection;
  }

  setEastRoomConnection(eastRoomConnection) {
    this.eastRoomConnection = eastRoomConnection;
  }

  setSouthRoomConnection(southRoomConnection) {
    this.southRoomConnection = southRoomConnection;
  }

  setWestRoomConnection(westRoomConnection) {
    this.westRoomConnection = westRoomConnection;
  }

}

// This ties a room with a door for use by another room
class RoomConnection {
  constructor(destinationRoom, doorIndex) {
    this.destinationRoom = destinationRoom;
    this.doorIndex = doorIndex;
  }
}

class Player {
  constructor(location, inventory) {
    this.location = location;
    this.inventory = inventory;
  }

  takeItem(itemIndex) {
    let takenItem = this.location.inventory.splice(itemIndex, 1)[0]; // removes the item from the room's inventory
    this.inventory.push(takenItem); // Adding item to player inventory
    console.log(`Added ${takenItem.name} to inventory`);
  }

  dropItem(itemIndex) {
    let droppedItem = this.inventory.splice(itemIndex, 1)[0]; // removes the item from the player's inventory
    this.location.inventory.push(droppedItem); // Adding item to player's current room's inventory
    console.log(`Dropped ${droppedItem.name} to the floor`);
  }

  displayInventory() {
    for(itemIndex in this.inventory) {
      console.log(`${this.inventory[itemIndex].name}\n`)
    }

    if (this.inventory.length == 0) {
      console.log("There's nothing in your inventory!")
    }
  }
}

/*
  array [1, 2, 3, 4]
  array.splice(2, 1) <--- return array [3]
  array [1, 2, 4]
 */

class Game {
  constructor(player, rooms, doors) {
    this.player = player;
    this.rooms = rooms;
    this.doors = doors;
  }
}

class Item {
  constructor(name, canBePickedUp, description) {
    this.name = name;
    this.canBePickedUp = canBePickedUp;
    this.description = description;
  }
}

function setupGame() {
  
  // Setup rooms
  let rooms = [];

  // Setup room one items
  let mainStreetItems = [];
  let mainStreetSign = new Item('sign', false, 'The sign reads: "Welcome to Burlington Code Academy!\n Come on inside!\n If the door is locked, use the code 12345"');
  let mainStreetPaper = new Item('paper', true, 'A random piece of paper with no value');
  mainStreetItems.push(mainStreetSign);
  mainStreetItems.push(mainStreetPaper);
  
  // Setup //! Main Street
  let mainStreet = new Room(
    `182 Main St.
    You are standing on Main Street between Church and South Winooski.
    There is a door here. A keypad sits on the handle.
    On the door is a handwritten sign.\n`, mainStreetItems);
    
  // Setup //! Foyer
  let foyerItems = [];
  let foyerTable = new Item('table', false, 'A wooden table in the middle of the room');
  let foyerMedallion = new Item('paper', true, 'A peculiar looking medallion. It looks like it can be slotted into something');
  foyerItems.push(foyerTable);
  foyerItems.push(foyerMedallion);
  let foyer = new Room(`You are in a foyer. Or maybe it's an antechamber. 
  Or a vestibule. 
  Or an entryway. 
  Or an atrium. 
  Or a narthex. 
  But let's forget all that fancy vocabulary, and just call it a foyer.
  Anyways, it's definitely not a mudroom. 
  You immediately notice a random medallion tucked into the corner of the room.`, foyerItems);

  //Setup //! Bedroom
  let bedRoomItems = [];
  let bedRoomBed = new Item(`bed`, false, `A normal looking bed`);
  let bedRoomDesk = new Item(`desk`, false, `There's a standard desk with a monitor on top of it and a computer beneath it.\n 
  There appears to be a note hanging out of a drawer.`);
  let bedRoomLetter = new Item(`letter`, true, `You are trapped in the house! If you want to leave, find my secret room hahahahaaaa\n
  Looks like there's scribbles on the bottom you can barely make out\n
  "Searc te iving oom - 432024"`); // Living Room door will be locked, requires code 432024
  let bedRoomChair = new Item(`chair`, false, `A slightly worn desk chair, appears to have no use`);
  bedRoomItems.push(bedRoomBed);
  bedRoomItems.push(bedRoomDesk);
  bedRoomItems.push(bedRoomLetter);
  bedRoomItems.push(bedRoomChair);

  let bedRoom = new Room(`Stepping into the bedroom, your eyes meet a creepy looking bed, barely lit by the window.\n 
  A rickety desk sits against the wall, bare but for a single chair. There's a sense of unease in this room, but there must be something important here`, bedRoomItems);
  
  
  //Setup //! Kitchen
  let kitchenItems = [];
  let kitchenCupboard = new Item(`cupboard`, false, `There's a cupboard filled with fine china and decorative items`);
  let kitchenCounter = new Item(`counter`, false, `A knife lies casually on the kitchen counter, ready for action in the heart of culinary creativity.`);
  let kitchenKnife = new Item(`knife`, true, `Why are you READING a knife? Weirdo.`);
  kitchenItems.push(kitchenCupboard);
  kitchenItems.push(kitchenCounter);
  kitchenItems.push(kitchenKnife);
  
  let kitchen = new Room(`In the kitchen, a simple cupboard stands against one wall, storing essentials out of sight.\n 
  Nearby, a spacious counter provides ample workspace, with a knife resting on its surface, ready for use.`, kitchenItems);
  

  //Setup //! Living Room
  let livingRoomItems = [];
  let livingRoomSofa = new Item(`sofa`, false, `What a nice sofa! Looks very comfy`);
  let livingRoomCoffeeTable = new Item(`coffee table`, false, `A very interesting looking coffee table, almost looks like it doesn't belong here.\n
  You hardly notice a piece of a note peeking out from under the coffee table.`);
  let livingRoomNote = new Item(`note`, true, `Enjoying your eternal stay here? Be sure to get comfy. Whatever you do, do not take my painting of the wall.`);
  let livingRoomPainting = new Item(`painting`, true, `An elaborate painting of a person, should I take it?`);
  let livingRoomMedallionSlot = new Item(`medallion slot`, false, `I think I can slot the medallion I found into it, should I?`);
  livingRoomItems.push(livingRoomSofa);
  livingRoomItems.push(livingRoomCoffeeTable);
  livingRoomItems.push(livingRoomNote);
  livingRoomItems.push(livingRoomPainting);
  livingRoomItems.push(livingRoomMedallionSlot);
  
  let livingRoom = new Room(`You enter what appears to be the living room of the home. A sofa huddles in the shadows, its faded form casting a sense of unease.\n
  Opposite, a coffee table rests silently, its surface holding secrets in the dim light.`)
  

  //Setup //! Secret(Final) Room
  let secretRoomItems = [];
  let secretRoomWorkBench = new Item(`work bench`, false, `Looks like whoever captured me does most of their dirty work here.\n
  Against the back of the workbench, you spot a wallet full of cash.`);
  let secretRoomWallet = new Item(`wallet`, true, `As you open the wallet, you find hundreds of dollars as well as the capturers id card`);
  secretRoomItems.push(secretRoomWorkBench);
  secretRoomItems.push(secretRoomWallet);

  let secretRoom = new Room(`As you enter the secret room, a shiver runs down your spine.\n
  You feel like you shouldn't be here, but feel that this must be the way out.\n
  A well kept workbench resides against the wall of the room.\n
  After another observation of the room, you make out an unlocked door almost entirely camoflauged into the wall. Should you open it?`);
  
  
  
  // Setup Doors
  let doors = [];
  let mainStreetfoyerDoor = new Door(true, "A plain door with a keypad on the door handle", "12345", "This door is locked.")
  doors.push(mainStreetfoyerDoor);
  let mainStreetTofoyerConnection = new RoomConnection(foyer, doors.indexOf(mainStreetfoyerDoor));
  let foyerTomainStreetConnection = new RoomConnection(mainStreet, doors.indexOf(mainStreetfoyerDoor));

  mainStreet.setNorthRoomConnection(mainStreetTofoyerConnection);
  foyer.setSouthRoomConnection(foyerTomainStreetConnection);
  
  // Setup player (put into mainStreet)
  let player = new Player(mainStreet, [])
    
  rooms.push(mainStreet);
  rooms.push(foyer);
  // Setup game (keeps track of player and rooms and doors)
  return new Game(player, rooms, doors)
}

const allowedDirections = ["north", "east", "south", "west"]
const allowedActions = ["inspect", "take", "open", "enter", "drop", "move", "i", "inventory"]
const noArgumentActions = ["i", "inventory"]

function ask(questionText) {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, resolve);
  });
}



async function handlePrompt() {
  let input = await ask(">_");
  if (input == "") return;

  // "inspect sign".split(" ")
  // ["inspect", "sign"]
  let inputTokens = input.split(" ");
  let action = inputTokens[0];
  if (allowedActions.includes(action) == false) {
    console.log(`Sorry, I don't know how to ${action}. Type /help for a list of commands`);
    return;
  }
  
  if (inputTokens.length < 2 && !noArgumentActions.includes(action)) {
    console.log(`Sorry, I don't know what to ${action}`);
    return;
  } 


  let actionArgument = "";
  if (inputTokens.length >= 2) {
    actionArgument = inputTokens[1];
  }

  /*
    We want to inspect actionArgument (this is the name of the item)

    Game: Player location (Room)
    Room: Inventory (Array of Items)
    Item: Description

    game.player.location.inventory = [Sign]
    Sign - Name: "sign", Description ...

    if our actionArgument is the name of an item in our location, then print the description
  */
 // *switch is a big-ass if else chain
  switch(action) {
    case "inspect":
      let inspectFoundItem = false;
      // Loop through items in the player's current room
      for (itemIndex in game.player.location.inventory) { // [for-item loop...]
        // Check if current actionArgument is equal to the name of an item in the current room
        if (actionArgument == game.player.location.inventory[itemIndex].name) {
          // Match, print the description of the found item
          console.log(game.player.location.inventory[itemIndex].description);
          inspectFoundItem = true;
          break; // <------ sorta frowned upon, but whatever. This just exits the [for-item loop...]
        }
      }
      if (!inspectFoundItem) {
        console.log(`There is no ${actionArgument} to inspect...`);
      }
      break;

case "take":
      if (actionArgument == "inventory") {
        game.player.displayInventory()
        break
      }
      let takeFoundItem = false;

      // loop through room's inventory to find item
      for (itemIndex in game.player.location.inventory) {
        // if item is found
        if (actionArgument == game.player.location.inventory[itemIndex].name) {
          takeFoundItem = true;
          // check if item can actually be picked up
          if (game.player.location.inventory[itemIndex].canBePickedUp) {
            game.player.takeItem(itemIndex)
          } else {
            console.log(`You cannot take the ${actionArgument}!`)
          }
          break; // Break out of itemIndex loop
        }
      }
      if (!takeFoundItem) {
        console.log(`I cannot find ${actionArgument} to take...`)
      }
      break;
      
      
    case "open":

        break
        
    case "enter":
          console.log("Would do enter")
          break
          
    case "drop":
      let dropFoundItem = false;

      for (itemIndex in game.player.inventory) {
        if (actionArgument == game.player.inventory[itemIndex].name) {
          dropFoundItem = true;
          game.player.dropItem(itemIndex);
          break // break out of itemIndex loop
        }
      }
      if (!dropFoundItem) {
        console.log(`You don't have ${actionArgument} in your inventory!`)
      }
      
      break;

    case "move":
      console.log("Would do move")
      break

    case "i":
    case "inventory":
      game.player.displayInventory();
      break
      
    default:
      console.log("Not yet implemented")
  }
}


async function start() {
  console.log(game.player.location.description);
  while (true) {
    await handlePrompt();
    
  }
  
  process.exit();
}

let game = setupGame();
start();