document.addEventListener('DOMContentLoaded', init, false);

function init() {
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register('/service-worker.js')
		.then((reg) => {
			//console.log('Service worker registered -->', reg);
		}, (err) => {
			console.error('Service worker not registered -->', err);
		});
	}

	/*
	if (!navigator.onLine) {
		const appHtml = document.getElementById('app');
		const offlineHtml = document.getElementById('offline');

		appHtml.style.display = 'none';
		offlineHtml.style.display = 'flex';
	}
	*/

}