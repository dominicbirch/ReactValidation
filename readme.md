# Examples
## ValidationForm
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