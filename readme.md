# Examples
## ValidationForm
### Example 1
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
    component={({ submit, validate, values: { name, age }, results }) =>
        <>
            <ValidationSummary value={results} />
            <input value={name} type="text">
            <input value={age} type="number">

            <button type="button" onClick={submit}>Validate</button>
        </>}
    />
```
### Example 2
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
            testArray1: new ArrayValidator(requireValue(), composeHandler<string>(requireValue(), requireMinimumLength(2)), i => `String ${i}`),
            testArray2: requireValue(),
            testArray3: new ArrayValidator(requireValue(), requireValue()),
            testNested: {
                1: requireValue(),
                2: requireValue()
            }
        }}
        component={({ submit, results }) =>
            <form onSubmit={submit} method="none">
                <ValidationSummary value={results} />
                <button type="submit">Test</button>
            </form>} />
```

## ValidationHandlers<T>
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