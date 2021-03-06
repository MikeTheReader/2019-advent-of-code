# Day 14 - Space Stoichiometry

Always sucks to run out of gas -- especially in the loneliness of space. Guessing there's no AAA out there.

The first part of this is parsing the reactions out to a data structure. The simplest one I can think of looks like an array of:

```javascript
{
  inputs: [
    {
      chemical: 'ORE',
      quantity: 10
    },
    {
      chemical: 'A',
      quantity: 5
    }
  ],
  outputs: [
    {
      chemical: 'AB',
      quantity: 1
    },
    {
      chemical: 'CD',
      quantity: 5
    }
  ]
}
```

The only problem with this strcuture is that it hides the references to the chemicals. It seems like what we need is the ability to work backwards from FUEL, so we'll need to find the reaction that ends in FUEL and then get the inputs and find the reactions that procduce the inputs and so on.

Looking again at the same data, there are no reactions that produce multiple outputs. So, we could do a data structure like this:

```javascript
{
  FUEL: {
    inputs: [
      {
        chemical: 'ORE',
        quantity: 10
      },
      {
        chemical: 'A',
        quantity: 5
      }
    ],
    outputQuantity: 10
  },
  A: {
    inputs: [
      {
        chemical: 'ORE',
        quantity: 5
      }
    ]
    outputQuantity: 5
  }
}
```
That way, we're able to quickly index based on the output and work backwards. (Updated to inclue output quantity.)

Started by trying with a regular expression, but got tied up in the variable number of inputs and went back to splitting the string up to parse.

Now that we have the reaction parsed the goal would be to go through and determine how many ORE to make one FUEL.

Once we've parsed everything and put it into a keyed object, we'll easily be able to get FUEL and figure out what we need to make it. For each thing we need to make it, figure out what we need to make that, stepping back in order until we find ORE. Keep the running total.

This one had me a bit stumped on both the first half and second half. When I finally reframed around keeping leftovers the first half became easy. When I reversed the problem and make the first half more efficient, then the second half came in.

The second half involved essentially guessing at how many fuel could be created and then doing a binary chop until we got the right number.