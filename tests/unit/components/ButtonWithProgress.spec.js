import ButtonWithProgress from '../../../src/components/ButtonWithProgress.vue';
import {render, screen}  from "@testing-library/vue";
import userEvent from "@testing-library/user-event";

let button;
function setup(isDisabled=true, isLoading=false, type="submit"){
	render(ButtonWithProgress,{
		props:{
			isDisabled: isDisabled,
			isLoading: isLoading,
			type: type,
		},
		slots:{
			default: 'test'
		}
	});

	button = screen.queryByRole('button',{ name: 'test' });
}

it.each`
	state						|	isDisabled
	${'disabled'}		| ${'true'}
	${'enabled'}		| ${'false'}
`("displays button $state and hides loading spinner", ({state, isDisabled}) =>{
	let disabledButton = isDisabled === 'true' ? true : false;
	setup(disabledButton);
	const spinner = screen.queryByRole('status');
	expect(spinner).not.toBeInTheDocument();
	if(state === 'disabled')
		expect(button).toBeDisabled();
	else
		expect(button).toBeEnabled();
});

it("displays button disabled and shows loading spinner", () => {
	setup(true, true);
	const spinner = screen.queryByRole('status');
	expect(button).toBeDisabled();
	expect(spinner).toBeInTheDocument();
});