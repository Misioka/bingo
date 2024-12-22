import React from 'react';
import './App.css';

const App = () => {
    const restoreBingo = JSON.parse(localStorage.getItem('bingo') || '[]')
    const [imagesSet, setImagesSet] = React.useState<number[]>(Array(31).fill(1).map((_v, i) => i + 1).filter((image) => !restoreBingo.includes(image)));
    const [bingoImages, setBingoImages] = React.useState<number[]>(restoreBingo);
    const [bingoImage, setBingoImage] = React.useState<number>();
    let interval: NodeJS.Timer | undefined

    const findNearest = (num: number, arr: number[]): number => {
        return arr.reduce((prev, curr) => Math.abs(curr - num) < Math.abs(prev - num) ? curr : prev);
    };

    window.onkeydown = (e: KeyboardEvent) => {
        if (e.key === ' ' && !interval) {
            if (window.confirm('Opravdu losovat?')) {
                let i = 0
                interval = setInterval(() => {
                    const random = findNearest(Math.floor(Math.random() * 31) + 1, imagesSet);
                    setBingoImage(random);
                    i++;
                    if (i > 25 && interval) {
                        localStorage.setItem('bingo', JSON.stringify([...bingoImages, random]))
                        setImagesSet(imagesSet.filter(image => image !== random));
                        setBingoImages([...bingoImages, random]);
                        clearInterval(interval);
                        i = 0;
                        interval = undefined
                    }
                }, 100)
            }
        }
    }

    return (
        <div className="App">
            <header className="App-header">
                {bingoImage ?
                    <img className="App-random-image" src={`/images/${bingoImage}.webp`} alt="big-bingo-image"/> :
                    <samp className="App-question">?</samp>}
                <div className="App-row"> {Array(31).fill(1).map((_, index) => (
                    <div className="App-col">
                        <img key={index} className="App-image"
                             src={bingoImages[index] ? `/images/${bingoImages[index]}.webp` : `/question.png`}
                             style={{opacity: bingoImages[index] ? 1 : 0}} alt="bingoimage"/>
                    </div>
                ))}
                </div>
            </header>
        </div>
    );
}

export default App;
