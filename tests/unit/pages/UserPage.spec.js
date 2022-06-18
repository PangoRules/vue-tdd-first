import UserPage from "../../../src/pages/UserPage.vue";
import { setupServer } from "msw/node";
import { rest } from "msw";
import {render, screen, waitFor}  from "@testing-library/vue";
import apiUrls from "../../../src/util/apiUrls.js";

function setup(id = 1) {
	render(UserPage, {
		global: { mocks: { $route: { params: { id: id } } } }
	});
}

const server = setupServer(
	rest.get(`${apiUrls.USER_GET_USER}:id`, (req, res, context) => {
		if(req.params.id==="1"){
			return res(context.status(200), context.json({
				id: 1,
				username: "user1",
				email: "user1@mail.com",
				image: null
			}));
		}
		return res(context.status(404), context.json({
			message: "User not found"
		}))
	})
);

beforeAll(() => server.listen());

beforeEach(async () => server.resetHandlers());

afterAll(() => server.close());

describe("User Page", () =>{
	it("displays username on page when user is found", async() =>{
		setup();
		await waitFor(()=>{
			expect(screen.queryByText("user1")).toBeInTheDocument();
		})
	});
	it("doesn't display username if api call on progress", () =>{
		setup();
		expect(screen.queryByText("user1")).not.toBeInTheDocument();
	})
	it("displays spinner on api call", async () =>{
		setup();
		const spinner = await screen.findByRole("status");
		expect(spinner).toBeInTheDocument();
	});
	it("hides spinner after api call completed", async() =>{
		setup();
		const spinner = screen.queryByRole("status");
		expect(spinner).not.toBeInTheDocument();
	});
	it("displays error message received from backend when user is not found", async () => {
		setup(100);
		await waitFor(() => {
			expect(screen.queryByText("User not found")).toBeInTheDocument();
		});
	})
})