import React from 'react';
import { Link } from 'react-router-dom';

import logoImg from '../../assets/images/logo.svg';
import backIcon from '../../assets/images/icons/back.svg';

import './styles.css'

interface PageHeaderProps {
    title: string;
    description?: string;
}

const PageHeader: React.FC<PageHeaderProps> = (prop) => {
    return (
        <header className="page-header">
            <div className="top-bar-container">
                <Link to="/">
                    <img src={backIcon} alt="Voltar"/>
                </Link>
                <Link to="/">
                    <img src={logoImg} alt="Proffy"/>
                </Link>
            </div>
            <div className="header-content">
                <strong>{prop.title}</strong>
                { prop.description && <p>{prop.description}</p> }
                {prop.children}
            </div>
        </header>
    );
}

export default PageHeader;