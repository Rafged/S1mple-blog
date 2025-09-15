import React from "react";

const Header = (props) => {
  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <a className="navbar-brand" href="/">
          Realworld Blog
        </a>

        <ul className="nav navbar-nav pull-xs-right">
          <li className="nav-item">
            <a className="nav-link" href="/">
              <i className="fa fa-home green-icon"></i> Home
            </a>
          </li>

          <li className="nav-item">
            <a className="nav-link" href="/editor">
              <i className="fa fa-pen green-icon"></i> New Post
            </a>
          </li>

          <li className="nav-item">
            <a className="nav-link" href="/settings">
              <i className="fa fa-cog green-icon"></i> Settings
            </a>
          </li>

          {props.currentUser && (
            <li className="nav-item">
              <a className="nav-link" href={`/@${props.currentUser.username}`}>
                <i className="fa fa-user green-icon"></i> {props.currentUser.username}
              </a>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
