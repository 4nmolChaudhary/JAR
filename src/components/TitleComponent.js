import React from 'react';
import Helmet from 'react-helmet';

const Title = ({ title }) => {
    var defaultTitle = "Sensaii";
    var newTitle = "Sensaii | " + title;
    return (
        <Helmet>
            <link 
                rel="icon" 
                type="image/png" 
                href="/proassets/images/project-jarvis.png" 
                sizes="16x16"
            />
            <title>{title ? newTitle : defaultTitle}</title>
        </Helmet>
    );
};

export default Title;
