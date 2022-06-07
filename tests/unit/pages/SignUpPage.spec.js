import SignUpPage from "../../../src/pages/SignUpPage.vue";
import {render, screen}  from "@testing-library/vue";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import userServices from '../../../src/api/userServices.js';
import user from "../../../src/models/user.js";

describe("Sign Up Page", () => {
    describe("Layout", () => {
        it('has sign up header',() => {
            render(SignUpPage);
            const header = screen.queryByRole('heading', { name: 'Sign Up' });
            expect(header).toBeInTheDocument();
        });
        it('has username input', () => {
            render(SignUpPage);
            const input = screen.queryByLabelText("Username");
            expect(input).toBeInTheDocument();
        });
        it('has email input', () => {
            render(SignUpPage);
            const input = screen.queryByLabelText("E-mail");
            expect(input).toBeInTheDocument();
        });
        it('has password input', () => {
            render(SignUpPage);
            const input = screen.queryByLabelText("Password");
            expect(input).toBeInTheDocument();
        });
        it('has password type for password input', () => {
            render(SignUpPage);
            const input = screen.queryByLabelText("Password");
            expect(input.type).toBe("password");
        });
        it('has password repeat input', () => {
            render(SignUpPage);
            const input = screen.queryByLabelText("Password Repeat");
            expect(input).toBeInTheDocument();
        });
        it('has password type for password repeat input', () => {
            render(SignUpPage);
            const input = screen.queryByLabelText("Password Repeat");
            expect(input.type).toBe("password");
        });
        it('has sign up button',() => {
            render(SignUpPage);
            const button = screen.queryByRole('button', { name: 'Sign Up' });
            expect(button).toBeInTheDocument();
        });
        it('has sign up button disabled initially',() => {
            render(SignUpPage);
            const button = screen.queryByRole('button', { name: 'Sign Up' });
            expect(button).toBeDisabled();
        });
    });
    describe("Interactions", () => {
        it("enables button when password and password repeat fields have same value", async () => {
            render(SignUpPage);
            const passwordInput = screen.queryByLabelText("Password");
            const passwordRepeatInput = screen.queryByLabelText("Password Repeat");
            const button = screen.queryByRole('button', { name: 'Sign Up' });

            await userEvent.type(passwordInput, "P4ssword");
            await userEvent.type(passwordRepeatInput, "P4ssword");
            expect(button).toBeEnabled();
        });
        it("sends username, email and password to backend after clicking the button", async () => {
            render(SignUpPage);
            const usernameInput = screen.queryByLabelText("Username");
            const emailInput = screen.queryByLabelText("E-mail");
            const passwordInput = screen.queryByLabelText("Password");
            const passwordRepeatInput = screen.queryByLabelText("Password Repeat");
            const button = screen.queryByRole('button', { name: 'Sign Up' });

            await userEvent.type(usernameInput, "user1");
            await userEvent.type(emailInput, "user1@gmail.com");
            await userEvent.type(passwordInput, "P4ssword");
            await userEvent.type(passwordRepeatInput, "P4ssword");

            const userFields = new user("user1", "user1@gmail.com", "P4ssword");

            const mockFn = jest.fn();
            userServices.createNewUser = mockFn;

            await userEvent.click(button);

            const firstCall = mockFn.mock.calls[0];
            const body = firstCall[0];

            expect(body).toEqual(userFields);
        });
    })
});
