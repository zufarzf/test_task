def de_format_number(numbers):
    if numbers:
        numbers = numbers.replace(' ', '')

        if numbers: return float(numbers)
        elif numbers == '': return 0
    
    return None