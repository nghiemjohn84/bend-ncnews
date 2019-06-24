const { expect } = require('chai');
const { formatDate, makeRefObj, formatComments } = require('../db/utils/utils');

describe('formatDate', () => {
    it('returns an empty array when an empty array is passed', () => {
        expect(formatDate([])).to.eql([])
    });
    it('returns the converted timestamp date and created_at key when just one key is passed', () => {
        const input = [{created_at: 1471522072389}]
        const actual = formatDate(input)
        const expected = [{created_at: '8/18/2016, 1:07:52 PM'}]
        expect(actual).to.eql(expected)
    })
    it('returns the converted timestamp date and created_at key when an item with multiple keys is passed', () => {
        const input = [{
                title: 'Running a Node App',
                topic: 'coding',
                author: 'jessjelly',
                created_at: 1471522072389
            }]
        const actual = formatDate(input)
        const expected = [{
                title: 'Running a Node App',
                topic: 'coding',
                author: 'jessjelly',
                created_at: '8/18/2016, 1:07:52 PM'
            }]
        expect(actual).to.eql(expected)
    }); 
    it('returns the converted timestamp date and created_at key when more than one object with multiple keys are passed', () => {
        const input = [{
                title: 'Running a Node App',
                topic: 'coding',
                author: 'jessjelly',
                created_at: 1471522072389
            },
            {
                body:
                  "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                belongs_to: "They're not exactly dogs, are they?",
                created_by: 'butter_bridge',
                votes: 16,
                created_at: 1511354163389,
              },
              {
                title: "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
                topic: 'coding',
                author: 'jessjelly',
                created_at: 1500584273256
              }
        ]
        const actual = formatDate(input)
        const expected = [{
                title: 'Running a Node App',
                topic: 'coding',
                author: 'jessjelly',
                created_at: '8/18/2016, 1:07:52 PM'
            },
            {
                body:
                  "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                belongs_to: "They're not exactly dogs, are they?",
                created_by: 'butter_bridge',
                votes: 16,
                created_at: '11/22/2017, 12:36:03 PM',
              },
              {
                title: "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
                topic: 'coding',
                author: 'jessjelly',
                created_at: '7/20/2017, 9:57:53 PM'
              }]
        expect(actual).to.eql(expected)
    });

});

describe('makeRefObj', () => {
    it('returns an empty object when an empty array is passed')
    const input = []
    const actual = makeRefObj(input)
    const expected = ({})
    expect(actual).to.eql(expected)
});

describe('formatComments', () => {});
