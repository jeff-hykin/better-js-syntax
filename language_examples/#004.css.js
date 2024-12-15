import { html } from "https://esm.sh/gh/jeff-hykin/elemental@0.6.3/main/deno.js"
import { css, cx } from "../../main/helpers/css.bundle.js"

// 
// Column
// 
const columnClass = css`
    display: flex;
    flex-direction: column;
    transition: all 0.4s ease-in-out 0s;
`
export function Column({ verticalAlignment, horizontalAlignment, children, ...arg }) {
    // 
    // class
    // 
    arg       = setupClassStyles(arg)
    arg.class = combineClasses(columnClass, arg.class)
    
    // 
    // style
    // 
    const justify = translateAlignment(verticalAlignment || "top")
    const align = translateAlignment(horizontalAlignment || "left")
    const verticalText = verticalAlignment == "center" ? "middle" : verticalAlignment // css is a special breed of inconsistent
    arg = setupStyles(arg, `
        display: flex;
        flex-direction: column;
        transition: all 0.4s ease-in-out 0s;
        justify-content: ${justify};
        align-items: ${align};
        text-align: ${horizontalAlignment};
        vertical-align: ${verticalText};
    `)

    // 
    // element
    // 
    return <div {...arg}>
        {children}
    </div>
}