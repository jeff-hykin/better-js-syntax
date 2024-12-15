
function setUrlParameter(param, value) {
    const url = new URL(window.location);
    url.searchParams.set(param, value);
    window.history.replaceState({}, '', url);
}

// 
// 
// Initialize
// 
// 
    import { html as initalHtml } from "https://cdn.skypack.dev/-/@!!!!!/elemental@v0.5.40-DV5IBrcN2nkO6U1jH4KY/dist=es2019,mode=imports/optimized/@!!!!!/elemental.js"

    // 
    // Custom elements
    // 
    const { html } = initalHtml.extend({
        Card,
    })
    window.html = html
    
    // 
    // animations
    // 
    const [ fadeIn, fadeOut ] = [
        [
            [
                { offset: 0.0, opacity: 0, },
                { offset: 0.1, opacity: 0, },
                { offset: 1.0, opacity: 1, },
            ], {
                duration: 1000,
                easing: 'ease-out',
                iterations: 1
            }
        ],
        [
            [
                { offset: 0.0, opacity: 1, },
                { offset: 0.1, opacity: 1, },
                { offset: 1.0, opacity: 0, },
            ], {
                duration: 1000,
                easing: 'ease-out',
                iterations: 1
            }
        ],
    ]

// 
// 
// Main Code
// 
// 
const convertSpecialText = (text)=>{
    const startText = text
    if (text.match(/&lt;checkbox&gt;/)) {
        text = text.replace(/&lt;checkbox&gt;/g, "<div class=checkbox><span style='white-space: pre;'> </span>")
    }
    const spacer = `<span style="white-space: pre;"> `
    
    text = text.replace(/<div><span style="white-space: pre;"> ?(<br>)?<\/span>(<br>)?<\/div>/g, `<div></div>`)
    if (text.match(/<div>- /)) {
        const size = `1rem`
        text = text.replace(/<div>- /g, `<br><div contenteditable="false" style="max-width: ${size};min-width: ${size};min-height:${size}; max-height: ${size};overflow: hidden;display: inline-block;position: relative; top: 3px;"><div class="ball"></div></div>${spacer}</span>`)
    }
    if (text.match(/<div>\s*<span style="white-space: pre;"> (.*?)<\/span>(.*?)<\/div>/)) {
        text = text.replace(/<div>\s*<span style="white-space: pre;"> (.*?)<\/span>(.*?)<\/div>/g, `<div style="display: inline-block;"><span style="white-space: pre;"> $1$2<\/span><\/div>`)
    }
    if (text.endsWith("<br>")) {
        text += "<div></div>"
    }
    // if (text.match(/\n/g)) {
    //     text = text.replace(/\n/g, "<span style='white-space: pre;'>\n</span>")
    // }
    if (text != startText) {
        return [text, true]
    } else {
        return [text, false]
    }
}
const card = html`
    <Card
        contenteditable
        onkeyup=${()=>{
            const [ text, shouldUpdate ] = convertSpecialText(card.innerHTML)
            if (shouldUpdate) {
                // causes cursor to jump
                card.innerHTML = text
                // move cursor to end
                const range = document.createRange();
                const selection = window.getSelection();
                
                // Clear any existing selections
                selection.removeAllRanges();
                
                // Set the range to the end of the contentEditable div
                range.selectNodeContents([...card.children].filter(each=>each.tagName == "DIV").at(-1));
                range.collapse(false); // Collapse the range to the end
                
                // Add the new range to the selection
                selection.addRange(range);
            }
            setUrlParameter("text", text)
        }}
        style="text-align: left;max-width: 12rem; height: fit-content; background: #fcfaca; box-shadow: none; border: black 1.2px solid; border-radius: 0.3em; position: relative; padding: 7px; margin-top: 1em; margin-left: 1em;left: 6rem; top: -1rem; top">
    </Card>
`
var text
try {
    text = JSON.parse(new URL(window.location.href).searchParams.get("text"))
} catch (error) {
    try {
        text = new URL(window.location.href).searchParams.get("text")
    } catch (error) {
        
    }
}
if (typeof text != "string") {
    text = "click me to edit"
    window.location.href = `${window.location.href}/?text=${JSON.stringify(text)}`
} else {
    var { 0: text } = convertSpecialText(text)
}
card.innerHTML = text
// import domtoimage from "https://esm.sh/dom-to-image@2.6.0"
// window.domtoimage =domtoimage
window.i = document.createElement("img")
var clippyBox
document.body = html`
    <body font-size=15px row wrap height="fit-content" width="100%" background="var(--soft-gray-gradient)">
        ${window.i}
        <div style="padding: 7px; position: absolute;top: 13rem;right: 1rem; display: block;">
            ${clippyBox = html`
            <div style="text-align: end; width: 25rem;">
            <div style="display: block; flex-direction: row; font-family: Helvetica, sans-serif; padding: 1em;position: relative;top: 1em;">
            ${card}
            <img style="width: 192px; height: 217px;display: inline;" 
            </img>
            </div></div>`}
        </div>
        <button style="position: fixed; right: 2rem; bottom: 2rem; background: lightgray; border-radius: 3px; border: 1px solid #777; color: #4d4d4d; padding: 4px;" onclick=${async ()=>{
            const img = document.createElement("img")
            const clippyBoxToRender = clippyBox.cloneNode(true)
            for (const each of [...clippyBoxToRender.querySelectorAll(".ball")]) {
                // hack so dom2image renders correctly
                each.style.transform = "scale(0.0999) translateY(-4.5px)"
            }
            clippyBox.replaceWith(clippyBoxToRender)
            const heightRatio = clippyBoxToRender.clientHeight/clippyBoxToRender.clientWidth
            var image = new Image()
            image.src = await domtoimage.toPng(clippyBoxToRender, { height: clippyBoxToRender.clientHeight  })
            // pixlate
            const pixelsWidth = 2000
            const canvas = document.createElement("canvas")
            const context = canvas.getContext('2d')
            canvas.width = pixelsWidth
            canvas.height = heightRatio * pixelsWidth
            console.log("waiting for it to load")
            window.image =image
            await new Promise((r)=>image.onload = r)
            console.log("loaded")
            context.drawImage(image, 0, 0)
                // , pixelsWidth, heightRatio * pixelsWidth)
            img.src = canvas.toDataURL('image/png')
            console.log("canvas.toDataURL('image/png')", canvas.toDataURL('image/png'))
            
            const link = document.createElement('a');
            
            link.href = img.src; // Set the href to the image source
            link.download = 'clippy.png'; // Set a default filename
            document.body.appendChild(link); // Append link to the body
            link.click(); // Trigger a click on the link to start the download
            document.body.removeChild(link); // Remove the link from the document
        }} >
            download
        </button>
    </body>
`
document.body.animate(...fadeIn)

// 
// 
// Components
// 
// 
    function Card({name, children, ...props}) {
        return html`
            <div
                name=${name}
                contenteditable
                border-radius="1em"
                box-shadow="0 4px 5px 0 rgba(0,0,0,0.10),0 1px 10px 0 rgba(0,0,0,0.08),0 2px 4px -1px rgba(0,0,0,0.24)"
                padding="1.5em 2em"
                background="var(--card-background, white)"
                ...${props}
                >
                    ${children}
            </div>
        `
    }