const sum = require('./sum')

const shopingList = ['buku','baju','celana']

test('harus ada celana', () => {
    expect(shopingList).toContain('celana');
    expect(new Set(shopingList)).toContain('celana')
})


// test('sum 5 dan 5 hasil 10', () => {
//     expect(sum(5,5)).toBe(10)
// })

// test('sum 5 dan -2 hasil 3', () => {
//     expect(sum(5,-2)).toBe(3)
// })