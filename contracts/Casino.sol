pragma solidity ^0.5.0;

contract Casino {
   address payable public owner;
   uint256 public minimumBet;
   uint256 public totalBet;
   uint256 public betsCount;
   uint256 public lastWinningNum;
   address payable[] public players;
   struct Player {
      uint256 amountBet;
      uint256 selectedNum;
   } 
   mapping(address => Player) public playerInfo;

   constructor() public {
     minimumBet = 1 ether;
   }

  

   // Betting function
   function bet(uint selectedNum) public payable{
     require(selectedNum >= 1 && selectedNum <= 15, "Number not between 1 an 15");
     require(msg.value >= minimumBet);
     playerInfo[msg.sender].amountBet = msg.value;
     playerInfo[msg.sender].selectedNum = selectedNum;
     betsCount++;
     players.push(msg.sender);
     totalBet += msg.value;
   }

    //Generating random number based on Now Stamp
   
   function generateWinner() public returns(uint256) {
    uint256 nonce;   
    uint256 randomnumber = uint(keccak256(abi.encodePacked(now, msg.sender, nonce))) % 15;
    uint256 winninNumber = randomnumber + 1;
    nonce++;
    //uint256 x= now;
    //uint256 y= x/10;
    //uint256 numberGenerated= x-y*10;
    
     lastWinningNum = winninNumber;
     //Calling distribute function based on the winner Number
     distributePrizes(winninNumber);
 
   }

   // Distribution Function
   function distributePrizes(uint256 numberWinner) private {
         address payable[10] memory winners; 
         uint256 count = 0; 
         for(uint256 i = 0; i < players.length; i++){
            address payable playerAddress = players[i];
            if(playerInfo[playerAddress].selectedNum == numberWinner){
               winners[count] = playerAddress;
               count++;
            } 
         }
         if(count > 0) {
            uint256 winnerEtherAmount = totalBet / count; 
            for(uint256 j = 0; j < count; j++){
               if(address(winners[j]) != address(0)) 
               winners[j].transfer(winnerEtherAmount);
            }
         }
         
         reset();
         
    }

    function reset() public {
      players.length = 0; // Delete all the players array
      totalBet = 0;
      betsCount = 0;
  }

 
}