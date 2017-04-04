main 
// #repeat forever {
//    get user input
//    process one frame
//    draw everything on the screen
//    wait until a frame's worth of time has elapsed
// }

// setup event listeners for buttons

render

  renderMap
  renderPlayer
  renderActions

update

  getInput

  executeInput


executeInput
  executeAction
  executeMovement(input)
    checkUndiscoveredSquare(x,y, direction)
      drawTile
    checkDiscoveredSquare(x,y, direction)
      checkValid(x,y)
      checkSpecialTraits(x,y)
      moveAgent(direction)