export default function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result); // reader.result already has data:image/png;base64, prefix
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}