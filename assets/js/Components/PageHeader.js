function PageHeader(_ref) {
    var title = _ref.title,
        hasBackButton = _ref.hasBackButton;


    return React.createElement(
        "header",
        { "class": "" },
        hasBackButton && React.createElement("img", { src: "../images/Btn-back.svg", "class": "btn-back",
            alt: "back button",
            onClick: function onClick() {
                return navigation("index", event);
            } }),
        title
    );
}

export default PageHeader;