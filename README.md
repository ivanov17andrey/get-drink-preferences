# get-drink-preferences

### Решить задачу определения предпочтительного напитка на определенной станции метро.

Информация о московском метро, в частности пересдадках (так как апи их не предоставляют) получается с википедии с помощью скрипта. Для получения верных координат (в википедии часть оказалась не верная) к полученным данным были добавлены координаты с помощью апи яндекс.карт.

---

Метро представляется в виде графа, а расстояние между станциями, посчитанное по формуле гаверсинуса, используется как веса для дуг. С помощью алгоритма Флойда-Уоршалла получается расстояние между всеми станциями. Алгоритм принимает название станции и возвращает предпочтение в напитке "чай" или "кофе", если предпочтений на самой станции нет, то расширяет поиск на 1км, и так до тех пор пока не будет получено какое-либо предпочтение, также по координатам рисуется карта метро и отмечаются станции с предпочтенями в напитках и станции, попавшие в радиус поиска.