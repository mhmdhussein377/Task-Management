export const handleCloseModal = (event, ref, setModalState) => {
    if(!ref.current.contains(event.target))
        setModalState(false)
}