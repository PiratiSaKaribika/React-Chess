// import br from './br.svg'
// import bk from './bk.svg'
// import bb from './bb.svg'
// import bki from './bki.svg'
// import bq from './bq.svg'
// import bp from './bp.svg'

// import wr from './wr.svg'
// import wk from './wk.svg'
// import wb from './wb.svg'
// import wki from './wki.svg'
// import wq from './wq.svg'
// import wp from './wp.svg'

const Wrapper = ({children}) => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        {children}
    </svg>
)




const Br = () => (
    <Wrapper>
        <g fill="#000" stroke="#000" strokeWidth="1.5" strokeLinejoin="round">
            <path d="
                M 11,14 L 11,9 L 15,9 L 15,11 L 20,11 L 20,9 L 25,9 L 25,11 L 30,11 L 30,9 L 34,9 L 34,14
                L 31,17 L 31,29.5 L 33,32 L 33,36 L 12,36 L 12,32 L 14,29.5 L 14,17 Z
            "/>
            <path d="M 9,39 L 36,39 L 36,36 L 9,36 L 9,39 z"/>
        </g>
        <g fill="none" stroke="#FFF" strokeLinecap="round">
            <line strokeWidth="1.2" x1="11" y1="14.0" x2="34" y2="14.0"/>
            <line strokeWidth="0.8" x1="14" y1="17.0" x2="31" y2="17.0"/>
            <line strokeWidth="0.8" x1="14" y1="29.5" x2="31" y2="29.5"/>
            <line strokeWidth="1.2" x1="12" y1="32.0" x2="33" y2="32.0"/>
            <line strokeWidth="1.2" x1="12" y1="35.5" x2="33" y2="35.5"/>
        </g>
    </Wrapper>
)

const Bk = () => (
    <Wrapper>
        <g fill="#000" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18"/>
            <path d="M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.958,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 C 9,30 5.997,31 6,26 C 6,24 12,14 12,14 C 12,14 13.89,12.1 14,10.5 C 13.27,9.506 13.5,8.5 13.5,7.5 C 14.5,6.5 16.5,10 16.5,10 L 18.5,10 C 18.5,10 19.28,8.008 21,7 C 22,7 22,10 22,10"/>
        </g>
        <g fill="#FFF" stroke="#FFF" strokeWidth="1.5" strokeLinejoin="round">
            <path stroke="none" d="M 24.55,10.4 L 24.1,11.85 L 24.6,12 C 27.75,13 30.25,14.49 32.5,18.75 C 34.75,23.01 35.75,29.06 35.25,39 L 35.2,39.5 L 37.45,39.5 L 37.5,39 C 38,28.94 36.62,22.15 34.25,17.66 C 31.88,13.17 28.46,11.02 25.06,10.5 L 24.55,10.4 Z"/>
            <path d="M 9.5,25.5 A 0.5,0.5,0 1,1 8.5,25.5 A 0.5,0.5,0 1,1 9.5,25.5 Z"/>
            <path d="M 15.25,14.2 A 0.5,1.5,30 1,1 13.75,16.8 A 0.5,1.5,30 1,1 15.25,14.2 Z"/>
        </g>
    </Wrapper>
)


const Bb = () => (
    <Wrapper>
        <g fill="#000" stroke="#000" strokeWidth="1.5" strokeLinejoin="round">
            <circle cx="22.5" cy="8" r="2.5"/>
            <path d="M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,30 30,30 C 30,27.5 27.5,26 27.5,26 C 33,24.5 33.5,14.5 22.5,10.5 C 11.5,14.5 12,24.5 17.5,26 C 17.5,26 15,27.5 15,30 C 15,30 14.5,30.5 15,32 Z"/>
            <path d="M 9,36 C 12.39,35.03 19.11,36.43 22.5,34 C 25.89,36.43 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.35,38.99 36,38.5 C 32.61,37.53 25.89,38.96 22.5,37.5 C 19.11,38.96 12.39,37.53 9,38.5 C 7.646,38.99 6.677,38.97 6,38 C 7.354,36.06 9,36 9,36 Z"/>
        </g>
        <g fill="none" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round">
            <path d="M 17.5,26 L 27.5,26"/>
            <path d="M 15.0,30 L 30.0,30"/>
            <path d="M 22.5,15 L 22.5,22 M 20,17.5 L 25,17.5"/>
        </g>
    </Wrapper>
)

const Bki = () => (
    <Wrapper>
        <g fill="#000" stroke="#000" strokeWidth="1.5" strokeLinejoin="round">
            <path fill="none" strokeLinecap="round" d="M 22.5,11.63 L 22.5,6 M 20,8 L 25,8"/>
            <path d="M 22.5,25 C 22.5,25 27,17.5 25.5,14.5 C 25.5,14.5 24.5,12 22.5,12 C 20.5,12 19.5,14.5 19.5,14.5 C 18,17.5 22.5,25 22.5,25"/>
            <path d="M 11.5,37 C 17,40.5 27,40.5 32.5,37 L 32.5,30 C 32.5,30 41.5,25.5 38.5,19.5 C 34.5,13 25,16 22.5,23.5 L 22.5,27 L 22.5,23.5 C 19,16 9.5,13 6.5,19.5 C 3.5,25.5 11.5,29.5 11.5,29.5 L 11.5,37"/>
        </g>
        <g fill="none" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path strokeLinecap="square" d="M 22.5,20 C 22.5,20 25.75,17 24.5,14.5 C 24.5,14.5 24,13 22.5,13 C 21,13 20.5,14.5 20.5,14.5 C 19.25,17 22.5,20 22.5,20"/>
            <path d="M 32,29.5 C 32,29.5 40.5,25.5 38.03,19.85 C 34.15,14 25,18 22.5,24.5 L 22.51,26.6 L 22.5,24.5 C 20,18 9.906,14 6.997,19.85 C 4.5,25.5 11.85,28.85 11.85,28.85"/>
            <path d="M 11.5,30 C 17,27 27,27 32.5,30"/>
            <path d="M 11.5,33.5 C 17,30.5 27,30.5 32.5,33.5"/>
            <path d="M 11.5,37 C 17,34 27,34 32.5,37"/>
        </g>
    </Wrapper>
)

const Bq = () => (
    <Wrapper>
        <g fill="#000" stroke="#000" strokeWidth="1.5" strokeLinejoin="round">
            <path d="M 9,26 C 17.5,24.5 30,24.5 36,26 L 38.5,13.5 L 31,25 L 30.7,10.9 L 25.5,24.5 L 22.5,10 L 19.5,24.5 L 14.3,10.9 L 14,25 L 6.5,13.5 L 9,26 Z"/>
            <circle cx="6"    cy="12" r="2"/>
            <circle cx="14"   cy="9"  r="2"/>
            <circle cx="22.5" cy="8"  r="2"/>
            <circle cx="31"   cy="9"  r="2"/>
            <circle cx="39"   cy="12" r="2"/>
            <path d="M 9,26 C 9,28 10.5,28 11.5,30 C 12.5,31.5 12.5,31 12,33.5 C 10.5,34.5 10.5,36 10.5,36 C 9,37.5 11,38.5 11,38.5 C 17.5,39.5 27.5,39.5 34,38.5 C 34,38.5 36,37.5 34.5,36 C 34.5,36 34.5,34.5 33,33.5 C 32.5,31 32.5,31.5 33.5,30 C 34.5,28 36,28 36,26 C 27.5,24.5 17.5,24.5 9,26 Z"/>
        </g>
        <g fill="none" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round">
            <path d="M 9,26 C 17.5,24.5 30,24.5 36,26"/>
            <path d="M 11.5,30 C 15,29 30,29 33.5,30"/>
            <path d="M 12,33.5 C 18,32.5 27,32.5 33,33.5"/>
        </g>
    </Wrapper>
)

const Bp = () => (
    <Wrapper>
        <g fill="#000" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="miter">
            <path d="M 22.5,9
                C 20.29,9 18.5,10.79 18.5,13 C 18.5,13.89 18.79,14.71 19.28,15.38
                C 17.33,16.5 16,18.59 16,21 C 16,23.03 16.94,24.84 18.41,26.03
                C 15.41,27.09 11,31.58 11,39.5
                L 34,39.5
                C 34,31.58 29.59,27.09 26.59,26.03
                C 28.06,24.84 29,23.03 29,21 C 29,18.59 27.67,16.5 25.72,15.38
                C 26.21,14.71 26.5,13.89 26.5,13 C 26.5,10.79 24.71,9 22.5,9
            Z"/>
        </g>
    </Wrapper>
)



const Wr = () => (
    <Wrapper>
        <g fill="#FFF" stroke="#000" strokeWidth="1.5" strokeLinejoin="round">
            <path d="
                M 11,14 L 11,9 L 15,9 L 15,11 L 20,11 L 20,9 L 25,9 L 25,11 L 30,11 L 30,9 L 34,9 L 34,14
                L 31,17 L 31,29.5 L 33,32 L 33,36 L 12,36 L 12,32 L 14,29.5 L 14,17 Z
            "/>
            <path d="M 9,39 L 36,39 L 36,36 L 9,36 L 9,39 z"/>
        </g>
        <g fill="none" stroke="#000" strokeLinecap="round">
            <line strokeWidth="1.2" x1="11" y1="14.0" x2="34" y2="14.0"/>
            <line strokeWidth="0.8" x1="14" y1="17.0" x2="31" y2="17.0"/>
            <line strokeWidth="0.8" x1="14" y1="29.5" x2="31" y2="29.5"/>
            <line strokeWidth="1.2" x1="12" y1="32.0" x2="33" y2="32.0"/>
        </g>
    </Wrapper>
)

const Wk = () => (
    <Wrapper>
        <g fill="#FFF" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18"/>
            <path d="M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.958,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 C 9,30 5.997,31 6,26 C 6,24 12,14 12,14 C 12,14 13.89,12.1 14,10.5 C 13.27,9.506 13.5,8.5 13.5,7.5 C 14.5,6.5 16.5,10 16.5,10 L 18.5,10 C 18.5,10 19.28,8.008 21,7 C 22,7 22,10 22,10"/>
        </g>
        <g fill="#000" stroke="#000" strokeWidth="1.5" strokeLinejoin="round">
            <path d="M 9.5,25.5 A 0.5,0.5,0 1,1 8.5,25.5 A 0.5,0.5,0 1,1 9.5,25.5 Z"/>
            <path d="M 15.25,14.2 A 0.5,1.5,30 1,1 13.75,16.8 A 0.5,1.5,30 1,1 15.25,14.2 Z"/>
        </g>
    </Wrapper>
)

const Wb = () => (
    <Wrapper>
        <g fill="#FFF" stroke="#000" strokeWidth="1.5" strokeLinejoin="round">
            <circle cx="22.5" cy="8" r="2.5"/>
            <path d="M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,30 30,30 C 30,27.5 27.5,26 27.5,26 C 33,24.5 33.5,14.5 22.5,10.5 C 11.5,14.5 12,24.5 17.5,26 C 17.5,26 15,27.5 15,30 C 15,30 14.5,30.5 15,32 Z"/>
            <path d="M 9,36 C 12.39,35.03 19.11,36.43 22.5,34 C 25.89,36.43 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.35,38.99 36,38.5 C 32.61,37.53 25.89,38.96 22.5,37.5 C 19.11,38.96 12.39,37.53 9,38.5 C 7.646,38.99 6.677,38.97 6,38 C 7.354,36.06 9,36 9,36 Z"/>
        </g>
        <g fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round">
            <path d="M 17.5,26 L 27.5,26"/>
            <path d="M 15.0,30 L 30.0,30"/>
            <path d="M 22.5,15 L 22.5,22 M 20,17.5 L 25,17.5"/>
        </g>
    </Wrapper>
)

const Wki = () => (
    <Wrapper>
        <g fill="#FFF" stroke="#000" strokeWidth="1.5" strokeLinejoin="round">
            <path fill="none" strokeLinecap="round" d="M 22.5,11.63 L 22.5,6 M 20,8 L 25,8"/>
            <path d="M 22.5,25 C 22.5,25 27,17.5 25.5,14.5 C 25.5,14.5 24.5,12 22.5,12 C 20.5,12 19.5,14.5 19.5,14.5 C 18,17.5 22.5,25 22.5,25"/>
            <path d="M 11.5,37 C 17,40.5 27,40.5 32.5,37 L 32.5,30 C 32.5,30 41.5,25.5 38.5,19.5 C 34.5,13 25,16 22.5,23.5 L 22.5,27 L 22.5,23.5 C 19,16 9.5,13 6.5,19.5 C 3.5,25.5 11.5,29.5 11.5,29.5 L 11.5,37"/>
        </g>
        <g fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round">
            <path d="M 11.5,30 C 17,27 27,27 32.5,30"/>
            <path d="M 11.5,33.5 C 17,30.5 27,30.5 32.5,33.5"/>
            <path d="M 11.5,37 C 17,34 27,34 32.5,37"/>
        </g>
    </Wrapper>
)
const Wq = () => (
    <Wrapper>
        <g fill="#FFF" stroke="#000" strokeWidth="1.5" strokeLinejoin="round">
            <path d="M 9,26 C 17.5,24.5 30,24.5 36,26 L 38.5,13.5 L 31,25 L 30.7,10.9 L 25.5,24.5 L 22.5,10 L 19.5,24.5 L 14.3,10.9 L 14,25 L 6.5,13.5 L 9,26 Z"/>
            <circle cx="6"    cy="12" r="2"/>
            <circle cx="14"   cy="9"  r="2"/>
            <circle cx="22.5" cy="8"  r="2"/>
            <circle cx="31"   cy="9"  r="2"/>
            <circle cx="39"   cy="12" r="2"/>
            <path d="M 9,26 C 9,28 10.5,28 11.5,30 C 12.5,31.5 12.5,31 12,33.5 C 10.5,34.5 10.5,36 10.5,36 C 9,37.5 11,38.5 11,38.5 C 17.5,39.5 27.5,39.5 34,38.5 C 34,38.5 36,37.5 34.5,36 C 34.5,36 34.5,34.5 33,33.5 C 32.5,31 32.5,31.5 33.5,30 C 34.5,28 36,28 36,26 C 27.5,24.5 17.5,24.5 9,26 Z"/>
        </g>
        <g fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round">
            <path d="M 11.5,30 C 15,29 30,29 33.5,30"/>
            <path d="M 12,33.5 C 18,32.5 27,32.5 33,33.5"/>
        </g>
    </Wrapper>
)
const Wp = () => (
    <Wrapper>
        <g fill="#FFF" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="miter">
            <path d="M 22.5,9
                C 20.29,9 18.5,10.79 18.5,13 C 18.5,13.89 18.79,14.71 19.28,15.38
                C 17.33,16.5 16,18.59 16,21 C 16,23.03 16.94,24.84 18.41,26.03
                C 15.41,27.09 11,31.58 11,39.5
                L 34,39.5
                C 34,31.58 29.59,27.09 26.59,26.03
                C 28.06,24.84 29,23.03 29,21 C 29,18.59 27.67,16.5 25.72,15.38
                C 26.21,14.71 26.5,13.89 26.5,13 C 26.5,10.79 24.71,9 22.5,9
            Z"/>
        </g>
    </Wrapper>
)






const pieceMap = {
    br: Br,
    bk: Bk,
    bb: Bb,
    bki: Bki,
    bq: Bq,
    bp: Bp,
    wr: Wr,
    wk: Wk,
    wb: Wb,
    wki: Wki,
    wq: Wq,
    wp: Wp
}

export const PieceImg = ({name}) => {
    const Img = pieceMap[name]
    if(!Img) { return; }
    return <Img />
}