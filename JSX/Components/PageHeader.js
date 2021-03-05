function PageHeader({ title, hasBackButton }) {

    return (
        <header class="">
            {
                hasBackButton && 
                    <img src="../images/Btn-back.svg" class="btn-back" 
                    alt="back button" 
                    onClick={() => navigation("index", event)} />
            }
            {title}
        </header>
    )
}

export default PageHeader