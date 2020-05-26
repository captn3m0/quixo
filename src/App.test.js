import Quixo from './App';

test('returns valid positions for corners', () => {
  expect(Quixo.validPositions(0)).toEqual(expect.arrayContaining([4,20]));
  expect(Quixo.validPositions(4)).toEqual(expect.arrayContaining([0,24]));
  expect(Quixo.validPositions(20)).toEqual(expect.arrayContaining([0,24]));
  expect(Quixo.validPositions(24)).toEqual(expect.arrayContaining([4,20]));
});

test('returns valid positions for top edge', () => {
  expect(Quixo.validPositions(1)).toEqual(expect.arrayContaining([0,21,4]));
  expect(Quixo.validPositions(2)).toEqual(expect.arrayContaining([0,22,4]));
  expect(Quixo.validPositions(3)).toEqual(expect.arrayContaining([0,23,4]));
});

test('returns valid positions for left edge', () => {
  expect(Quixo.validPositions(5)).toEqual(expect.arrayContaining([0,20,9]));
  expect(Quixo.validPositions(10)).toEqual(expect.arrayContaining([0,20,14]));
  expect(Quixo.validPositions(15)).toEqual(expect.arrayContaining([0,20,19]));
});

test('returns valid positions for right edge', () => {
  expect(Quixo.validPositions(9)).toEqual(expect.arrayContaining([4,24,5]));
  expect(Quixo.validPositions(14)).toEqual(expect.arrayContaining([4,24,10]));
  expect(Quixo.validPositions(19)).toEqual(expect.arrayContaining([4,24,15]));
});

test('returns valid positions for bottom edge', () => {
  expect(Quixo.validPositions(21)).toEqual(expect.arrayContaining([20,24,1]));
  expect(Quixo.validPositions(22)).toEqual(expect.arrayContaining([20,24,2]));
  expect(Quixo.validPositions(23)).toEqual(expect.arrayContaining([20,24,3]));
});

test('toRowColumn', () => {
  expect(Quixo.toRowColumn(23)).toEqual([4,3])
})

test('movePieces top row right', ()=> {
  let result = Quixo.movePieces([
    1,2,3,4,5,
    0,0,0,0,0,
    0,0,0,0,0,
    0,0,0,0,0,
    0,0,0,0,0,
  ], 0,4,10)

  expect(result).toEqual([
    2,3,4,5,10,
    0,0,0,0,0,
    0,0,0,0,0,
    0,0,0,0,0,
    0,0,0,0,0,
  ]
  )
})

test('movePieces top row left', ()=> {
  let result = Quixo.movePieces([
    1,2,3,4,5,
    0,0,0,0,0,
    0,0,0,0,0,
    0,0,0,0,0,
    0,0,0,0,0,
  ], 3,0,10)

  expect(result).toEqual([
    10,1,2,3,5,
    0,0,0,0,0,
    0,0,0,0,0,
    0,0,0,0,0,
    0,0,0,0,0,
  ]
  )
})

test('movePieces right column to bottom right', ()=> {
  let result = Quixo.movePieces([
    1,2,3,4,5,
    0,0,0,0,1,
    0,0,0,0,2,
    0,0,0,0,3,
    0,0,0,0,4,
  ], 9,24,10)

  expect(result).toEqual([
    1,2,3,4,5,
    0,0,0,0,2,
    0,0,0,0,3,
    0,0,0,0,4,
    0,0,0,0,10,
  ])
})


test('movePieces left column to right column', ()=> {
  let result = Quixo.movePieces([
    1,2,3,4,5,
    2,0,0,0,1,
    5,6,7,8,9,
    4,0,0,0,3,
    5,0,0,0,4,
  ], 10,14,100)

  expect(result).toEqual([
    1,2,3,4,5,
    2,0,0,0,1,
    6,7,8,9,100,
    4,0,0,0,3,
    5,0,0,0,4,
  ])
})


test('game should detect victory condition', ()=> {
  let result = Quixo.IsVictory([
    0,0,0,0,0,
    -1,-1,-1,-1,-1,
    -1,-1,-1,-1,-1,
    -1,-1,-1,-1,-1,
    -1,-1,-1,-1,-1,
  ], 0)

  expect(result).toEqual(true)
})


test('game should detect victory condition if both players end at the same turn', ()=> {
  let result = Quixo.IsVictory([
    0,0,0,0,0,
    -1,-1,-1,-1,-1,
    1,1,1,1,1,
    -1,-1,-1,-1,-1,
    -1,-1,-1,-1,-1,
  ], 0)

  expect(result).toEqual(false)
})


test('game should detect diagonal victories', ()=> {
  let result = Quixo.IsVictory([
    0,0,0,0,0,
    -1,0,-1,-1,-1,
    1,1,0,1,1,
    -1,-1,-1,0,-1,
    -1,-1,-1,-1,0,
  ], 0)

  expect(result).toEqual(true)
})
