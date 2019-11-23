import App from './App.svelte';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'tabulator-tables/dist/css/tabulator.min.css';
{/* <style src="../../node_modules/tabulator-tables/dist/css/tabulator.min.css"></style> */}

const app = new App({
	target: document.body,
	props: {
		name: 'world'
	}
});

export default app;