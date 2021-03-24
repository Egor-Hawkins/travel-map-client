export const mapState = {
    center: [0, 0],
    zoom: 3,
    controls: ['zoomControl'],
    type: 'yandex#hybrid',
};

export const mapStyle = {
    position: 'absolute',
    width: '100%',
    height: '100%',
};

export const DEFAULT_OPTIONS = {
    type: 'DEFAULT',
    fillColor: '#ffffff',
    fillOpacity: 0.0
};

const SELECT_OPTIONS = {
    type: 'SELECT',
    fillColor: '#fb6c3f',
    fillOpacity: 0.8
};

const HIGHLIGHT_OPTIONS = {
    type: 'HIGHLIGHT',
    fillColor: '#f5ab94',
    fillOpacity: 0.6
};

export function enterCountry(event) {
    const target = event.get('target');
    if (target.options.get("type") !== 'SELECT') {
        target.options.set(HIGHLIGHT_OPTIONS);
    }
}

export function leaveCountry(event) {
    const target = event.get('target');
    if (target.options.get("type") !== 'SELECT') {
        target.options.set(DEFAULT_OPTIONS);
    }
}

export function clickOnCountry(event) {
    const target = event.get('target');
    if (target.options.get("type") === 'SELECT') {
        target.options.set(DEFAULT_OPTIONS);
    } else {
        target.options.set(SELECT_OPTIONS);
    }
}
