/* eslint-disable prettier/prettier */
import './styles/loaderOverlayStyles.css'

type propsType = {
    isLoading:boolean
}

const LoaderOverlay = (props:propsType):JSX.Element | null => {
    if (!props.isLoading) {
        return null;
    }

    return (
        <div className='overlay'>
            <div className='spinner'></div>
        </div>
    );
};

export default LoaderOverlay;

