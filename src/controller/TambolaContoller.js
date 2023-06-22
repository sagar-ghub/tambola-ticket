const Ticket = require("../models/tickcet");

function generateTambolaTicket() {
  const entries = new Array(3)
    .fill(0)
    .map(() => new Array(9).fill(0).map(() => 0));

  function numOfEntries() {
    return entries
      .map((r) => r.filter((c) => c).length)
      .reduce((a, b) => a + b, 0);
  }

  function isCompleted() {
    return numOfEntries() === 15;
  }

  function isRowCompleted(rowIndex) {
    const rowValues = getRowValues(rowIndex);
    return rowValues.filter((r) => r).length === 5;
  }

  function isColCompleted(colIndex) {
    const colValues = getColumnValues(colIndex);
    return colValues.filter((c) => c).length === 3;
  }

  function updateEntry(rowIndex, colIndex, value) {
    entries[rowIndex][colIndex] = value;
  }

  function getColumnValues(colIndex) {
    return entries.map((row) => row[colIndex]);
  }

  function getRowValues(rowIndex) {
    return entries[rowIndex];
  }

  function generate() {
    const numbers = new Array(9)
      .fill(0)
      .map((r, rI) => new Array(10).fill(0).map((c, cI) => rI * 10 + cI + 1));

    getRowValues(0).forEach((c, cIndex) => {
      const randomIndex = Math.floor(Math.random() * numbers[cIndex].length);
      const selectedNumber = numbers[cIndex][randomIndex];

      const randomRow = [0, 1, 2].filter((r) => !isRowCompleted(r));
      const selectedRow =
        randomRow[Math.floor(Math.random() * randomRow.length)] || 0;

      if (!isColCompleted(cIndex) && entries[selectedRow][cIndex] === 0) {
        updateEntry(selectedRow, cIndex, selectedNumber);
        numbers[cIndex].splice(randomIndex, 1);
      }
    });

    function fillRecursively() {
      getColumnValues(0).forEach((r, rIndex) => {
        getRowValues(0).forEach((c, cIndex) => {
          const randomIndex = Math.floor(
            Math.random() * numbers[cIndex].length
          );
          const selectedNumber = numbers[cIndex][randomIndex];

          const setOrNot = Math.random() > 0.5;

          if (
            setOrNot &&
            !isCompleted() &&
            !isRowCompleted(rIndex) &&
            !isColCompleted(cIndex) &&
            entries[rIndex][cIndex] === 0
          ) {
            updateEntry(rIndex, cIndex, selectedNumber);
            numbers[cIndex].splice(randomIndex, 1);
          }
        });
      });

      if (!isCompleted()) {
        fillRecursively();
      } else {
        sort();
      }
    }

    fillRecursively();

    // return entries;
  }

  function sort() {
    let ticket = entries;

    for (var col = 0; col < 9; col++) {
      if (
        ticket[0][col] !== 0 &&
        ticket[1][col] !== 0 &&
        ticket[2][col] !== 0
      ) {
        for (var i = 0; i < 2; i++) {
          for (var j = i + 1; j < 3; j++) {
            if (ticket[i][col] > ticket[j][col]) {
              var temp = ticket[i][col];
              ticket[i][col] = ticket[j][col];
              ticket[j][col] = temp;
            }
          }
        }
      } else if (
        ticket[0][col] !== 0 &&
        ticket[1][col] !== 0 &&
        ticket[2][col] === 0
      ) {
        if (ticket[0][col] > ticket[1][col]) {
          var temp = ticket[0][col];
          ticket[0][col] = ticket[1][col];
          ticket[1][col] = temp;
        }
      } else if (
        ticket[0][col] !== 0 &&
        ticket[1][col] === 0 &&
        ticket[2][col] !== 0
      ) {
        if (ticket[0][col] > ticket[2][col]) {
          var temp = ticket[0][col];
          ticket[0][col] = ticket[2][col];
          ticket[2][col] = temp;
        }
      } else if (
        ticket[0][col] === 0 &&
        ticket[1][col] !== 0 &&
        ticket[2][col] !== 0
      ) {
        if (ticket[1][col] > ticket[2][col]) {
          var temp = ticket[1][col];
          ticket[1][col] = ticket[2][col];
          ticket[2][col] = temp;
        }
      }
    }
  }

  generate();

  return entries;
}

const generateMultipleTickets = (count) => {
  const tickets = {};
  // let tickets = [];
  for (let i = 0; i < count; i++) {
    // tickets.push(generateTambolaTicket());
    // return tickets;
    tickets[`ticket${i + 1}`] = generateTambolaTicket();
  }
  return tickets;
};

const Tickets = require("../models/tickcet");

exports.generate = async (req, res) => {
  const { count } = req.body;
  if (!count || count < 1 || count > 1000 || !Number.isInteger(count))
    return res.status(400).json({ message: "count is required" });

  const data = generateMultipleTickets(count);

  const ticket = await Tickets.create({ tickets: data });

  return res.status(200).json({
    id: ticket._id,
  });
};

exports.getTicketById = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "id is required" });
  const tickets = await Tickets.findOne({ _id: id });

  return res.status(200).json({
    tickets: tickets.tickets,
  });
};

exports.getTickets = async (req, res) => {
  const tickets = await Tickets.find({});

  return res.status(200).json({
    tickets: tickets,
  });
};
