import { screen, render, waitFor, cleanup } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { rest } from "msw";
import { removeEmptyKeysInObject } from "../../../src/util/utils.js";
import user from "../../../src/models/user.js";
import apiUrls from "../../../src/util/apiUrls.js";
import LoginPage from "../../../src/Pages/LoginPage.vue";
import i18n from "../../../src/locales/i18n.js";
import en from "../../../src/locales/en/en.json";
import es from "../../../src/locales/es/es.json";
import LanguageSelector from "../../../src/components/LanguageSelector.vue";

let requestBody, requestCounter = 0;
let acceptLanguageHeader;
const server = setupServer(
	rest.post(apiUrls.USER_LOGIN, (req, res, context) =>{
		requestBody = req.body;
		requestCounter += 1;
		return res(context.status(401));
	}),
	// rest.post(apiUrls.USER_LOGIN, (req, res, context) => {
	// 	requestBody = req.body;
	// 	requestCounter += 1;
	// 	acceptLanguageHeader = req.headers.get("Accept-Language");
	// 	return res(context.status(200));
	// })
);

let submitButton, passwordInput, emailInput, spanishLanguage, englishLanguage;
async function setup(){
	const app = {
		components:{
			LoginPage,
			LanguageSelector
		},
		template:`
		<LoginPage />
		<LanguageSelector />
		`,
	};
	render(app,{ global:{ plugins: [i18n] } });

	emailInput = screen.queryByLabelText(en.email);
	passwordInput = screen.queryByLabelText(en.password);
	submitButton = screen.queryByRole('button', { name: en.login });
	spanishLanguage = screen.queryByTitle("Spanish");
	englishLanguage = screen.queryByTitle("English");
}
async function setupFilled(){
	await setup();
	await userEvent.type(emailInput, "test1@email.com");
	await userEvent.type(passwordInput, "test1");
}

beforeAll(() => server.listen());

beforeEach(async () => {
    requestCounter = 0;
    await setup();
    server.resetHandlers();
});

afterAll(() => server.close());

describe("Login Page", () =>{
	describe("Layout", () => {
		it("has login header", () => {
			expect(screen.queryByRole("heading", {name: en.login})).toBeInTheDocument();
		});
		it('has email input', () => {
			expect(emailInput).toBeInTheDocument();
		});
		it('has password input', () => {
			expect(passwordInput).toBeInTheDocument();
		});
		it('has password type for password input', () => {
			expect(passwordInput.type).toBe("password");
		});
		it('has login button', async () => {
			expect(submitButton).toBeInTheDocument();
		});
		it('has login button disabled initially', async () =>{

			expect(submitButton).toBeDisabled();
		});
	});

	fdescribe("Interactions", () => {
		beforeEach(async () => {
			cleanup()
			await setupFilled();
		});
		it("enables button when email and password are filled", async () => {
			expect(submitButton).toBeEnabled();
		});
		it("displays spinner after clicking the button", async () => {
			expect(screen.queryByRole("status")).not.toBeInTheDocument();
			await userEvent.click(submitButton);
			expect(screen.queryByRole("status")).toBeInTheDocument();
		});
		it("hides spinner after api call finishes with fail response", async () => {
			await userEvent.click(submitButton);
			await waitFor(() => {
				expect(screen.queryByRole("status")).not.toBeInTheDocument();
			})
		});
		it("sends email and password to backend after clicking the button", async () => {
			const userFields = removeEmptyKeysInObject(new user(null, "test1@email.com", "test1"));
			await userEvent.click(submitButton);
			expect(requestBody).toEqual(userFields);
		});
		//BUG: Apparently email is undefined on second call of the button click
		it.skip("disables login button when there is an ongoing api call", async () => {
			await userEvent.click(submitButton);
			await userEvent.click(submitButton);
			expect(requestCounter).toBe(1);
		});
	});

	describe("Internationalization", () => {
		it("initially displays all text in english", () =>{
			expect(screen.queryByRole("heading", {name: en.login})).toBeInTheDocument();
			expect(screen.queryByRole("button", {name: en.login})).toBeInTheDocument();
			expect(screen.queryByLabelText(en.username)).toBeInTheDocument();
			expect(screen.queryByLabelText(en.email)).toBeInTheDocument();
			expect(screen.queryByLabelText(en.password)).toBeInTheDocument();
		});
		it.each`
			language        | jsonToSelect
			${'Spanish'}    | ${'es'}
			${'English'}    | ${'en'}
		`("displays all text in $language after selecting the language", async ({language, jsonToSelect}) =>{
				const langBtn = screen.queryByTitle(language);

				await userEvent.click(langBtn);

				const jsonSelected = jsonToSelect === 'es' ? es : en;

				expect(screen.queryByRole("heading", {name: jsonSelected.login})).toBeInTheDocument();
				expect(screen.queryByRole("button", {name: jsonSelected.login})).toBeInTheDocument();
				expect(screen.queryByLabelText(jsonSelected.username)).toBeInTheDocument();
				expect(screen.queryByLabelText(jsonSelected.email)).toBeInTheDocument();
				expect(screen.queryByLabelText(jsonSelected.password)).toBeInTheDocument();
		});
		
	});
})