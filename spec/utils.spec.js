const { expect } = require("chai");
const { formatDate, makeRefObj, formatComments } = require("../db/utils/utils");

describe("formatDate", () => {
  it("returns an empty array when an empty array is passed", () => {
    expect(formatDate([])).to.eql([]);
  });
  it("returns the converted timestamp date and created_at key when just one key is passed", () => {
    const input = [{ created_at: 1471522072389 }];
    const actual = formatDate(input);
    const expected = [{ created_at: new Date(1471522072389).toLocaleString() }];
    expect(actual).to.eql(expected);
  });
  it("returns the converted timestamp date and created_at key when an item with multiple keys is passed", () => {
    const input = [
      {
        title: "Running a Node App",
        topic: "coding",
        author: "jessjelly",
        created_at: 1471522072389
      }
    ];
    const actual = formatDate(input);
    const expected = [
      {
        title: "Running a Node App",
        topic: "coding",
        author: "jessjelly",
        created_at: new Date(1471522072389).toLocaleString()
      }
    ];
    expect(actual).to.eql(expected);
  });
  it("returns the converted timestamp date and created_at key when more than one object with multiple keys are passed", () => {
    const input = [
      {
        title: "Running a Node App",
        topic: "coding",
        author: "jessjelly",
        created_at: 1471522072389
      },
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      },
      {
        title:
          "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
        topic: "coding",
        author: "jessjelly",
        created_at: 1500584273256
      }
    ];
    const actual = formatDate(input);
    const expected = [
      {
        title: "Running a Node App",
        topic: "coding",
        author: "jessjelly",
        created_at: new Date(1471522072389).toLocaleString()
      },
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: new Date(1511354163389).toLocaleString()
      },
      {
        title:
          "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
        topic: "coding",
        author: "jessjelly",
        created_at: new Date(1500584273256).toLocaleString()
      }
    ];
    expect(actual).to.eql(expected);
  });
});

describe("makeRefObj", () => {
  it("returns an empty object when an empty array is passed", () => {
    const input = [];
    const actual = makeRefObj(input);
    const expected = {};
    expect(actual).to.eql(expected);
  });
  it("returns an object with one key value pair when one object with two key value pairs is passed", () => {
    const input = [{ article_id: 1, title: "A" }];
    const actual = makeRefObj(input);
    const expected = { A: 1 };
    expect(actual).to.eql(expected);
  });
  it("returns an object with key value pairs when multiple objects are passed", () => {
    const input = [
      { article_id: 1, title: "A" },
      { article_id: 2, title: "B" },
      { article_id: 3, title: "C" }
    ];
    const actual = makeRefObj(input);
    const expected = { A: 1, B: 2, C: 3 };
    expect(actual).to.eql(expected);
  });
});

describe("formatComments", () => {
  it("it returns an empty array when and empty array and object are both passewd as parameters", () => {
    const input = [];
    const ref = {};
    const actual = formatComments(input, ref);
    const expected = [];
    expect(actual).to.eql(expected);
  });
  it("it returns a new array where created_by has been renamed to an author key, belongs_to property has been renamed to an article_id and the created_at timestamp has been converted to a JS date object", () => {
    const input = [
      {
        created_by: "butter_bridge",
        belongs_to: "They're not exactly dogs, are they?",
        created_at: 1511354163389
      }
    ];
    const ref = { "They're not exactly dogs, are they?": 1 };
    const actual = formatComments(input, ref);
    const expected = [
      {
        author: "butter_bridge",
        article_id: 1,
        created_at: new Date(1511354163389).toLocaleString()
      }
    ];
    expect(actual).to.eql(expected);
  });
  it("it returns a new array where created_by has been renamed to an author key, belongs_to property has been renamed to an article_id and the created_at timestamp has been converted to a JS date object when multiple objects with multiple keys are passed", () => {
    const input = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      },
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      },
      {
        body:
          "What do you see? I have no idea where this will lead us. This place I speak of, is known as the Black Lodge.",
        belongs_to: "UNCOVERED: catspiracy to bring down democracy",
        created_by: "icellusedkars",
        votes: 16,
        created_at: 1101386163389
      }
    ];
    const ref = {
      "They're not exactly dogs, are they?": 1,
      "Living in the shadow of a great man": 2,
      "UNCOVERED: catspiracy to bring down democracy": 3
    };
    const actual = formatComments(input, ref);
    const expected = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        author: "butter_bridge",
        article_id: 1,
        created_at: new Date(1511354163389).toLocaleString()
      },
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        votes: 14,
        author: "butter_bridge",
        article_id: 2,
        created_at: new Date(1479818163389).toLocaleString()
      },
      {
        body:
          "What do you see? I have no idea where this will lead us. This place I speak of, is known as the Black Lodge.",
        votes: 16,
        author: "icellusedkars",
        article_id: 3,
        created_at: new Date(1101386163389).toLocaleString()
      }
    ];
    expect(actual).to.eql(expected);
  });
});
