'use strict';

const React     = require('react');
const useState  = React.useState;
const useEffect = React.useEffect;
const useRef    = React.useRef;
const PropTypes = require('prop-types');

const { LinearProgress } = require('@material-ui/core');


const useInterval = (callback, delay) => {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

const RedialScreen = (props) => {
    let [progress, setProgress] = useState(0);

    let retryTime = 60;
    if (props.router.getPath().startsWith('/conference')) {
        retryTime = 180;
    }
    let interval = 500;

    useInterval(() => {
        progress = progress + .5

        if (progress !== retryTime) {
            setProgress(progress);
        } else {
            hide();
        }
    }, interval);

    const hide = () => {
        props.hide();
        props.router.navigate('/ready');
    }

    return (
        <div>
            <div className="modal-backdrop semi-transparent"></div>
            <div className="modal" style={{display: 'block'}}>
                <div className="loading">
                    <div className="loading-inner">
                        <i className="fa fa-4x fa-spin fa-cog" /><br />
                        <h1>Please wait...</h1>
                        <p> The connection has been lost. Attempting to resume the call.</p>
                            <div style={{maxWidth: '50%', margin: 'auto'}}>
                                <LinearProgress
                                    style={{marginTop: '2px'}}
                                    classes={{barColorPrimary: 'blue-bar'}}
                                    variant="determinate"
                                    value={progress * (100 / retryTime)}
                                />
                                <br />
                                <button className="btn btn-primary" onClick={hide}>Cancel resume</button>
                            </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

RedialScreen.propTypes = {
    router: PropTypes.object.isRequired,
    hide: PropTypes.func.isRequired
};


module.exports = RedialScreen;
