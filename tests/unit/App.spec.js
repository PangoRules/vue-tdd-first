import {render, screen, waitFor}  from "@testing-library/vue";
import App from "../../src/App.vue";
import i18n from "../../src/locales/i18n.js";
import userEvent from "@testing-library/user-event"

function setup(path){
    window.history.pushState({}, "", path);
    render(App,{
        global:{
            plugins: [i18n]
        }
    });
}

describe("Routing", () => {
    it.each`
        path            | pageTestId
        ${'/'}          | ${'home-page'}
        ${'/signup'}    | ${'signup-page'}
        ${'/login'}     | ${'login-page'}
        ${'/user/1'}    | ${'user-page'}
        ${'/user/2'}    | ${'user-page'}
    `("displays $pageTestId when path is $path", ({path, pageTestId}) => {
        setup(path);
        const page = screen.queryByTestId(pageTestId);
        expect(page).toBeInTheDocument();
    });
    it.each`
        path            | pageTestId
        ${'/'}          | ${'signup-page'}
        ${'/'}          | ${'login-page'}
        ${'/'}          | ${'user-page'}
        ${'/signup'}    | ${'home-page'}
        ${'/signup'}    | ${'login-page'}
        ${'/signup'}    | ${'user-page'}
        ${'/login'}    | ${'home-page'}
        ${'/login'}    | ${'signup-page'}
        ${'/login'}    | ${'user-page'}
        ${'/user/1'}    | ${'home-page'}
        ${'/user/1'}    | ${'signup-page'}
        ${'/user/1'}    | ${'login-page'}
    `("doesn't displays $pageTestId when at $path", ({path, pageTestId}) => {
        setup(path);
        const page = screen.queryByTestId(pageTestId);
        expect(page).not.toBeInTheDocument();
    });
    it.each`
        targetPage
        ${'Home'}
        ${'Sign-Up'}
        ${'Login'}
    `("has link to $targetPage on navbar", ({targetPage}) =>{
        setup("/");
        const link = screen.queryByRole("link", {name: targetPage});
        expect(link).toBeInTheDocument();
    });
    it.each`
        initialPath     | clickingTo    | visiblePage
        ${'/'}          | ${'Sign-Up'}  | ${'signup-page'}
        ${'/signup'}    | ${'Home'}     | ${'home-page'}
        ${'/signup'}    | ${'Login'}     | ${'login-page'}
    `("displays sign-up page after clicking sign-up link", async ({initialPath, clickingTo, visiblePage}) =>{
        setup(initialPath);
        const link = screen.queryByRole("link", {name: clickingTo});
        await userEvent.click(link);
        const page = screen.queryByTestId(visiblePage);
        expect(page).toBeInTheDocument();
    });
    it("displays home page when clicking brand logo", async() =>{
        setup('/login');
        const image = screen.queryByAltText("Hoaxify Logo");
        await userEvent.click(image);
        const page = screen.queryByTestId("home-page");
        expect(page).toBeInTheDocument();
    });
});