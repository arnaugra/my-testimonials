document.querySelectorAll(".copy").forEach(element => {
    const valueToCopy = element.dataset.copy

    let inline_svg = document.createElement("inline-svg");
    inline_svg.setAttribute("src", "/copy.svg")
    inline_svg.style.width = ".75em"
    inline_svg.style.marginLeft = ".25em"
    inline_svg.style.cursor = "pointer"

    inline_svg.addEventListener("click", (e) => navigator.clipboard.writeText(valueToCopy))

    element.append(inline_svg)
});
