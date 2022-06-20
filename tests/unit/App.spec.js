import {render, screen, waitFor}  from "@testing-library/vue";
import App from "../../src/App.vue";
import i18n from "../../src/locales/i18n.js";
import userEvent from "@testing-library/user-event";
import router from "../../src/routes/router.js";
import { setupServer } from "msw/node";
import { rest } from "msw";
import apiUrls from "../../src/util/apiUrls.js";
import store from "../../src/state/store.js";

const server = setupServer(
	rest.post(`${apiUrls.USER_ACTIVATE}:token`, (req, res, ctx) => {
		return res(ctx.status(200));
	}),
	rest.get(apiUrls.USER_CREATE, (req, res, context) => {
		return res(
			context.status(200),
			context.json({
				content: [
					{ id: 1, username: "user-in-list", email: "user-in-list@mail.com", image: null },
				],
				page: 0,
				size: 0,
				totalPages: 0,
			})
		);
	}),
	rest.get(`${apiUrls.USER_GET_USER}:id`, (req, res, context) => {
		const id = Number.parseInt(req.params.id);
		return res(context.status(200), context.json({
			id: id,
			username: "user"+id,
			email: "user"+id+"@mail.com",
			image: null
		}));
	}),
	rest.post(apiUrls.USER_LOGIN, (req, res, context) => {
		return rest(context.status(200), context.json({ id: 5, username: "user5", email: "user5@mail.com"}));
	})
);

beforeAll(() => server.listen());

beforeEach(async () => server.resetHandlers());

afterAll(() => server.close());

async function setup(path){
	render(App,{
			global:{
					plugins: [i18n, router, store]
			}
	});
	router.replace(path);
	await router.isReady();
}

describe("Routing", () => {
	it.each`
			path                    | pageTestId
			${'/'}                  | ${'home-page'}
			${'/signup'}            | ${'signup-page'}
			${'/login'}             | ${'login-page'}
			${'/user/1'}            | ${'user-page'}
			${'/user/2'}            | ${'user-page'}
			${'/activate/1234'}     | ${'activation-page'}
			${'/activate/5111'}     | ${'activation-page'}
	`("displays $pageTestId when path is $path", async ({path, pageTestId}) => {
			await setup(path);
			const page = screen.queryByTestId(pageTestId);
			expect(page).toBeInTheDocument();
	});
	it.each`
			path                    | pageTestId
			${'/'}                  | ${'signup-page'}
			${'/'}                  | ${'login-page'}
			${'/'}                  | ${'user-page'}
			${'/'}                  | ${'activation-page'}
			${'/signup'}            | ${'home-page'}
			${'/signup'}            | ${'login-page'}
			${'/signup'}            | ${'user-page'}
			${'/signup'}            | ${'activation-page'}
			${'/login'}             | ${'home-page'}
			${'/login'}             | ${'signup-page'}
			${'/login'}             | ${'user-page'}
			${'/login'}             | ${'activation-page'}
			${'/user/1'}            | ${'home-page'}
			${'/user/1'}            | ${'signup-page'}
			${'/user/1'}            | ${'login-page'}
			${'/user/1'}            | ${'activation-page'}
			${'/activate/1234'}     | ${'home-page'}
			${'/activate/1234'}     | ${'signup-page'}
			${'/activate/1234'}     | ${'login-page'}
			${'/activate/1234'}     | ${'user-page'}
	`("doesn't displays $pageTestId when at $path", async ({path, pageTestId}) => {
			await setup(path);
			const page = screen.queryByTestId(pageTestId);
			expect(page).not.toBeInTheDocument();
	});
	it.each`
			targetPage
			${'Home'}
			${'Sign-Up'}
			${'Login'}
	`("has link to $targetPage on navbar", async ({targetPage}) =>{
			await setup("/");
			const link = screen.queryByRole("link", {name: targetPage});
			expect(link).toBeInTheDocument();
	});
	it.each`
			initialPath     | clickingTo    | visiblePage
			${'/'}          | ${'Sign-Up'}  | ${'signup-page'}
			${'/signup'}    | ${'Home'}     | ${'home-page'}
			${'/signup'}    | ${'Login'}     | ${'login-page'}
	`("displays sign-up page after clicking sign-up link", async ({initialPath, clickingTo, visiblePage}) =>{
			await setup(initialPath);
			const link = screen.queryByRole("link", {name: clickingTo});
			await userEvent.click(link);
			const page = await screen.findByTestId(visiblePage);
			expect(page).toBeInTheDocument();
	});
	it("displays home page when clicking brand logo", async() =>{
			await setup('/login');
			const image = screen.queryByAltText("Hoaxify Logo");
			await userEvent.click(image);
			const page = screen.queryByTestId("home-page");
			expect(page).toBeInTheDocument();
	});
	it("navigates to user page when clicking the username on user list", async () =>{
			await setup('/');
			const user = await screen.findByText("user-in-list");
			await userEvent.click(user);
			const page = screen.queryByTestId("user-page");
			expect(page).toBeInTheDocument();
	});
});

fdescribe("Login", () =>{
	async function setupLoggedIn(){
		await setup("/login");
		await userEvent.type(screen.queryByLabelText("E-mail"), "user5@mail.com");
		await userEvent.type(screen.queryByLabelText("Password"), "P4ssword");
		await userEvent.click(screen.queryByRole("button", {name: "Login"}));
	}
	it("redirects to homepage after successful login", async () => {
		setupLoggedIn();
		const page = await screen.findByTestId("home-page");
		expect(page).toBeInTheDocument();
	});
	it("hides login and signup links after successful login", async () => {
		setupLoggedIn();
		await screen.findByTestId("home-page");
		const loginLink = screen.queryByRole("link", {name: "Login"});
		const signUpLink = screen.queryByRole("link", {name: "Sign Up"});
		expect(loginLink).not.toBeInTheDocument();
		expect(signUpLink).not.toBeInTheDocument();
	});
	it("displays my profile link on navbar after successful login", async () => {
		setupLoggedIn();
		await screen.findByTestId("home-page");
		const profileLink = screen.queryByRole("link", {name: "Profile"});
		expect(profileLink).toBeInTheDocument();
	});
	//FIXME: Can't get the header since it returns userNaN in the view
	it.skip("displays user page for logged in user when user clicks profile link", async () => {
		setupLoggedIn();
		await screen.findByTestId("home-page");
		const profileLink = screen.queryByRole("link", {name: "Profile"});
		await userEvent.click(profileLink);
		await screen.findByTestId("user-page");
		const header = await screen.findByRole("heading", {name: "user5"})
		expect(header).toBeInTheDocument();
	});

});