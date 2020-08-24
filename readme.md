## Example usage
```tsx
<ValidationForm
    values={{
        "name": "",
        "age": 37,
        "blah": {
            a: 1,
            b: "2"
        }
    }}
    rules={{
        name: n => n ? null : ["Please provide a name"],
        age: requireMinimum(18),
        blah: {
            a: requireMinimum(1),
            b: composeHandler(
                requireValue("b must have an answer"),
                requireMinimumLength(3)
            )
        }
    }}
    action={valid => alert(valid)}
    component={({ submit, validate, values: { name, age }, results }) =>
        <>
            <ValidationSummary value={results} />
            <p>{name}, {age}</p>
            <button type="button" onClick={submit}>Validate</button>
        </>}
/>

interface Address {
    line1: string;
    postcode: string;
}

export const ValidateAddress: ValidationHandlers<Address> = {
    line1: x => null,
    postcode: p => null
};
```