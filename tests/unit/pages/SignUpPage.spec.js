import SignUpPage from "../../../src/pages/SignUpPage.vue";
import {render, screen, waitFor}  from "@testing-library/vue";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import user from "../../../src/models/user.js";
import { setupServer } from "msw/node";
import { rest } from "msw";
import apiUrls from "../../../src/util/apiUrls.js";
import i18n from "../../../src/locales/i18n.js";
import en from "../../../src/locales/en/en.json";
import es from "../../../src/locales/es/es.json";

describe("Sign Up Page", () => {
    describe("Layout", () => {
        beforeEach(() => {
            render(SignUpPage,{ global:{plugins:[i18n]}  });
        });        
        
        it('has sign up header',() => {
            const header = screen.queryByRole('heading', { name: 'Sign Up' });
            expect(header).toBeInTheDocument();
        });
        it('has username input', () => {
            const input = screen.queryByLabelText("Username");
            expect(input).toBeInTheDocument();
        });
        it('has email input', () => {
            const input = screen.queryByLabelText("E-mail");
            expect(input).toBeInTheDocument();
        });
        it('has password input', () => {
            const input = screen.queryByLabelText("Password");
            expect(input).toBeInTheDocument();
        });
        it('has password type for password input', () => {
            const input = screen.queryByLabelText("Password");
            expect(input.type).toBe("password");
        });
        it('has password repeat input', () => {
            const input = screen.queryByLabelText("Password Repeat");
            expect(input).toBeInTheDocument();
        });
        it('has password type for password repeat input', () => {
            const input = screen.queryByLabelText("Password Repeat");
            expect(input.type).toBe("password");
        });
        it('has sign up button',() => {
            const button = screen.queryByRole('button', { name: 'Sign Up' });
            expect(button).toBeInTheDocument();
        });
        it('has sign up button disabled initially',() => {
            const button = screen.queryByRole('button', { name: 'Sign Up' });
            expect(button).toBeDisabled();
        });
    });
    describe("Interactions", () => {
        let requestBody;
        let requestCounter = 0;
        const server = setupServer(
            rest.post(apiUrls.USER_CREATE, (req, res, context) => {
                requestBody = req.body;
                requestCounter += 1;
                return res(context.status(200));
            })
        );

        beforeAll(() => server.listen());

        beforeEach(async () => {
            requestCounter = 0;
            await setupInputs();
            server.resetHandlers();
        });

        afterAll(() => server.close());

        let submitButton, passwordInput, passwordRepeatInput, emailInput, usernameInput;
        /**
         * Sets up the inputs and their values to test
         */
        async function setupInputs() {
            render(SignUpPage,{ global:{plugins:[i18n]}  });
            usernameInput = screen.queryByLabelText("Username");
            emailInput = screen.queryByLabelText("E-mail");
            passwordInput = screen.queryByLabelText("Password");
            passwordRepeatInput = screen.queryByLabelText("Password Repeat");
            submitButton = screen.queryByRole('button', { name: 'Sign Up' });

            await userEvent.type(usernameInput, "user1");
            await userEvent.type(emailInput, "user1@gmail.com");
            await userEvent.type(passwordInput, "P4ssword");
            await userEvent.type(passwordRepeatInput, "P4ssword");
        }

        const generateValidationError = (field, message) => {
            return rest.post(apiUrls.USER_CREATE, (req, res, context) => {
                return res.once(
                    context.status(400), 
                    context.json({
                        path: "/api/1.0/users",
                        message: "Validation Failure",
                        validationErrors: {
                            [field]: message
                        }
                    })
                );
            })
        }

        it("enables button when password and password repeat fields have same value", async () => {
            //When setupInputs completes beforeEach test is executed, all inputs are filled correctly
            expect(submitButton).toBeEnabled();
        });
        it("disables button when password and password repeat fields have different values", async () => {
            //When setupInputs completes beforeEach test is executed, all inputs are filled correctly
            const passwordRepeatInput = screen.queryByLabelText("Password Repeat");
            await userEvent.type(passwordRepeatInput, "P4ssword!");
            expect(submitButton).not.toBeEnabled();
        });
        it("disable button if there is a pending call", async () => {
            await userEvent.click(submitButton);
            await userEvent.click(submitButton);

            await screen.findByText("Please check your e-mail to activate your account");

            expect(requestCounter).toBe(1);             
        });
        it("displays spinner while request in progress", async () => {
            await userEvent.click(submitButton);

            const spinner = screen.queryByRole("status");

            expect(spinner).toBeInTheDocument();
        });
        it("hide spinner after request", async () => {
            await userEvent.click(submitButton);

            const spinner = screen.queryByRole("status");

            await waitFor(() => {
                expect(spinner).not.toBeInTheDocument();
            });
        });
        it("doesn't display spinner if no api request active", async () => {
            const spinner = screen.queryByRole('status');

            expect(spinner).not.toBeInTheDocument();
        });
        it("displays account activation information after successful sign up request", async () => {
            await userEvent.click(submitButton);

            const textSuccess = await screen.findByText("Please check your e-mail to activate your account");

            expect(textSuccess).toBeInTheDocument();
        });
        it("does not displays account activation information before sign up request", async () => {
            const textSuccess = screen.queryByText((content, element) => {
                return element.tagName.toLowerCase() === 'div' && content.startsWith('Please check')
            });

            expect(textSuccess).not.toBeInTheDocument();
        });
        it("does not displays account activation information after un-successful sign up request", async () => {
            server.use(generateValidationError('', ''))

            await userEvent.click(submitButton);

            const textSuccess = screen.queryByText((content, element) => {
                return element.tagName.toLowerCase() === 'div' && content.startsWith('Please check')
            });

            expect(textSuccess).not.toBeInTheDocument();
        });
        it("sends username, email and password to backend after clicking the button", async () => {
            const userFields = new user("user1", "user1@gmail.com", "P4ssword");
            await userEvent.click(submitButton);

            await screen.findByText((content, element) => {
                return element.tagName.toLowerCase() === 'div' && content.startsWith('Please check')
            });

            expect(requestBody).toEqual(userFields);
        });
        it("hides sign up form after successful sign up request", async() =>{
            const form = screen.queryByTestId("form-sign-up");

            await userEvent.click(submitButton);
            await waitFor(() => {
                expect(form).not.toBeInTheDocument();
            });
        });
        it.each`
            field           | message
            ${'username'}   | ${'Username cannot be null'}
            ${'email'}      | ${'E-mail cannot be null'}
            ${'password'}   | ${'Password must be at least 6 characters'}
        `("displays $message for field $field", async (params) =>{
            const { field, message } = params;
            server.use(generateValidationError(field, message));

            await userEvent.click(submitButton);

            const text = await screen.findByText(message);

            expect(text).toBeInTheDocument();
        });
        it("displays password mismatch error", async () =>{
            await userEvent.type(passwordRepeatInput, "P4ssword1");

            const text = await screen.findByText("Password mismatch");

            expect(text).toBeInTheDocument();
        });
        it.each`
            field           | message                                           | label
            ${'username'}   | ${'Username cannot be null'}                      | ${"Username"}
            ${'email'}      | ${'E-mail cannot be null'}                        | ${"E-mail"}
            ${'password'}   | ${'Password must be at least 6 characters'}       | ${"Password"}
        `("clears validation error after $field field is updated", async ({field, message, label}) =>{
            server.use(generateValidationError(field, message));

            await userEvent.click(submitButton);

            const text = await screen.findByText(message);

            const input = screen.queryByLabelText(label);

            await userEvent.type(input, "updated");

            expect(text).not.toBeInTheDocument();
        });
    });
    describe("Internationalization", () => {
        function setup(){
            render(SignUpPage,{ global:{plugins:[i18n]}  });
        }

        it("initially displays all text in english", () =>{
            setup();

            expect(screen.queryByRole("heading", {name: en.signUp})).toBeInTheDocument();
            expect(screen.queryByRole("button", {name: en.signUp})).toBeInTheDocument();
            expect(screen.queryByLabelText(en.username)).toBeInTheDocument();
            expect(screen.queryByLabelText(en.email)).toBeInTheDocument();
            expect(screen.queryByLabelText(en.password)).toBeInTheDocument();
            expect(screen.queryByLabelText(en.passwordRepeat)).toBeInTheDocument();
        });

        fit.each`
            language        | jsonToSelect
            ${'Spanish'}    | ${'es'}
            ${'English'}    | ${'en'}
        `("displays all text in $language after selecting the language", async ({language, jsonToSelect}) =>{
            setup();
            const langBtn = screen.queryByTitle(language);

            await userEvent.click(langBtn);

            const jsonSelected = jsonToSelect === 'es' ? es : en;

            expect(screen.queryByRole("heading", {name: jsonSelected.signUp})).toBeInTheDocument();
            expect(screen.queryByRole("button", {name: jsonSelected.signUp})).toBeInTheDocument();
            expect(screen.queryByLabelText(jsonSelected.username)).toBeInTheDocument();
            expect(screen.queryByLabelText(jsonSelected.email)).toBeInTheDocument();
            expect(screen.queryByLabelText(jsonSelected.password)).toBeInTheDocument();
            expect(screen.queryByLabelText(jsonSelected.passwordRepeat)).toBeInTheDocument();
        });
    });
});
