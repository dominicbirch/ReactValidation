# Examples

## ValidationForm

### Example 1

```tsx
import { composeHandler, requireLengthBetween, requirePattern, requireValue, ValidationForm, ValidationSummary } from '@dominicbirch/react-validation';
import React from 'react';
import './App.scss';


export default function App() {
  const [value, setValue] = React.useState("");

  return <ValidationForm
    values={{
      test: value
    }}
    rules={{
      test: composeHandler(requireValue(), requireLengthBetween(4, 64), requirePattern(/^\w+$/i, `The test field should contain only letters and numbers, but received '${value}'`))
    }}
    action={x => console.log(x)}
    render={({ submit, values: { test }, results }) =>
      <>
        <ValidationSummary value={results} />
        <input value={test || ""} onChange={({ currentTarget: { value: v } }: React.ChangeEvent<HTMLInputElement>) => setValue(v)} />
        <button type="button" onClick={submit}>Test</button>
      </>
    } />;
}

```

### Example 2

```tsx
<ValidationForm
    values={{
        "name": "",
        "age": 37,
        "blah": {
            a: 1,
            b: "2"
        },
        "address":{
            line1:"",
            postcode: ""
        }
    }}
    rules={{
        name: requireValue("Please provide a name"),
        age: requireMinimum(18),
        blah: {
            a: requireMinimum(1),
            b: composeHandler(
                requireValue("b must have an answer"),
                requireMinimumLength(3)
                requirePattern(/^\w+$/i)
            )
        },
        address: ValidateAddress
    }}
    action={valid => alert(valid)}
    render={({ submit, validate, values: { name, age }, results }) =>
        <>
            <ValidationSummary value={results} />
            <input value={name} type="text">
            <input value={age} type="number">

            <button type="button" onClick={submit}>Validate</button>
        </>}
    />
```

### Example 3

```tsx
export default () =>
    <ValidationForm
        values={{
            testArray1: ["One", "Two", "Three"],
            testArray2: [{ test: 1 }, { test: 2 }, { test: 3 }],
            testArray3: [[1, "One"], [2, "Two"], [3, "Three"]],
            testNested: {
                1: "Test 1",
                2: "Test 2"
            }
        }}
        rules={{
            testArray1: new ArrayValidatorBuilder<string>()
                .withLabelFormat((i, v) => v)
                .withRules(requireMinimumLength(2))
                .withRulesForEach(requireValue(), requireMinimumLength(3))
                .build(),
            testArray2: new ArrayValidatorBuilder<{ test?: number }>()
                .withLabelFormat((i, v) => `Item ${i + 1}: Test ${v.test}`)
                .withRules(requireValue(), requireMinimumLength(1))
                .withRuleForEach({
                    test: requireValue()
                })
                .build(),
            testArray3: new ArrayValidatorBuilder<React.ReactText[]>()
                .withRules(requireValue())
                .withRuleForEach(new ArrayValidatorBuilder<React.ReactText>()
                    .withRules(x => x.length !== 2 ? ["There should be exactly 2 items"] : null)
                    .build())
                .build(),
            testNested: {
                1: requireValue(),
                2: requireValue()
            }
        }}
        render={({ submit, results }) =>
            <form onSubmit={submit} method="none">
                <ValidationSummary value={results} />
                <button type="submit">Test</button>
            </form>} />;
```

## ValidationHandlers

```typescript
interface Address {
    line1: string;
    postcode: string;
}

export const ValidateAddress: ValidationHandlers<Address> = {
    line1: requireValue(),
    postcode: composeHandler(
        requireValue("The postcode field is required")
        ...
    )
};
```