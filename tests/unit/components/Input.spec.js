import Input from "../../../src/components/Input.vue";
import {render, screen, waitFor}  from "@testing-library/vue";

it("has is-invalid class for input when help is set", () =>{
    const { container } = render(Input, {
        props:{
            help: "Error message"
        }
    });

    const input = container.querySelector("input");

    expect(input.classList).toContain("is-invalid");
});
it("has invalid-feedback class for span when help is set", () => {
    const { container } = render(Input, {
        props:{
            help: "Error message"
        }
    });

    const span = container.querySelector("span");

    expect(span.classList).toContain("invalid-feedback");
});
it("doesn't have is-invalid class for input when help isn't set", () => {
    const { container } = render(Input);

    const input = container.querySelector("input");

    expect(input.classList).not.toContain("is-invalid");
});